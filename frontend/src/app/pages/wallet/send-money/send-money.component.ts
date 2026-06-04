import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ContentBoxComponent} from '../../../components/content-box/content-box.component';
import {BackLinkComponent} from '../../../shared/back-link/back-link.component';
import {
  TransactionsLayoutComponent
} from '../../../components/transactions/transactions-layout.component';
import {
  TransactionsInputLayoutComponent
} from '../../../components/transactions/transactions-input-layout/transactions-input-layout.component';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';
import {TransactionService} from '../../../client/services/transactions/transaction.service';
import {WebSocketService} from '../../../client/services/websocket/websocket.service';
import {Subscription} from 'rxjs';
import {MessageService} from '../../../client/services/message/message.service';
import {Transaction, TransactionResponse} from '../../../types/transaction/transaction.interface';

@Component({
  selector: 'app-send-money',
  standalone: true,
  imports: [
    ContentBoxComponent,
    BackLinkComponent,
    TransactionsLayoutComponent,
    TransactionsInputLayoutComponent
  ],
  templateUrl: './send-money.component.html',
  styleUrl: './send-money.component.css',
})
export class SendMoneyComponent implements OnInit, OnDestroy {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private messageService: MessageService = inject(MessageService);
  private tokenService: AuthTokenService = inject(AuthTokenService);
  private transactionService: TransactionService = inject(TransactionService);
  private websocketService: WebSocketService = inject(WebSocketService);

  transactions: Transaction[] = [];
  userId: number | null = this.tokenService.getUserId();
  limit: number = 20;
  isLoading: boolean = false;

  private websocketSubscription!: Subscription;

  ngOnInit(): void {
    this.loadTransactions();

    this.websocketSubscription = this.websocketService.message$.subscribe((message: any): void => {
      if (message.type === 'refresh') {
        this.handleWebSocketRefresh();
      }
    })
  }

  ngOnDestroy(): void {
    this.websocketSubscription.unsubscribe();
  }

  loadTransactions(): void {
    this.isLoading = true;

    this.transactionService
      .getTransactions(this.userId, this.limit, undefined)
      .subscribe((response: TransactionResponse): void => {
        this.transactions = filterTransactions(response, this.userId);
        this.isLoading = false;

        this.cdr.detectChanges();
      })
  }

  sendMoney(event: { username: string, amount: number }): void {
    this.transactionService.sendMoneyTransaction(event.username, event.amount)
    .subscribe({
      next: (): void => {
        this.messageService.success({ message: "Transaction sent successfully" });
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Couldn't send transaction" });
      }
    })
  }

  private handleWebSocketRefresh(): void {
    this.loadTransactions();
    this.cdr.detectChanges();
  }
}

function filterTransactions(response: TransactionResponse, userId: number | null): Transaction[] {
  return response.transactions.filter((transaction: Transaction): boolean =>
    transaction.type === 'send' && transaction.sender_id === userId
  );
}
