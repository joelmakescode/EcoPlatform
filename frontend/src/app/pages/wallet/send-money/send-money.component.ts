import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ContentBoxComponent} from '../../../component/content-box/content-box.component';
import {BackLinkComponent} from '../../../component/shared/back-link/back-link.component';
import {
  TransactionsLayoutComponent
} from '../../../component/shared/layouts/transactions-layout/transactions-layout.component';
import {
  TransactionsInputLayoutComponent
} from '../../../component/shared/layouts/transactions-layout/transactions-input-layout/transactions-input-layout.component';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';
import {TransactionService} from '../../../services/transactions/transaction.service';
import {Transaction} from '../../../client/models/transactions/transaction.model';
import {TransactionResponse} from '../../../client/models/transactions/transaction.model';
import {ErrorService} from '../../../services/messages/error/error.service';
import {SuccessService} from '../../../services/messages/success/success.service';
import {WebSocketService} from '../../../services/websocket/websocket.service';
import {Subscription} from 'rxjs';

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
  private errorService: ErrorService = inject(ErrorService);
  private successService: SuccessService = inject(SuccessService);
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
        this.successService.showApiSuccess("TRANSACTION_SENT_SUCCESSFUL");
      },
      error: (err: any): void => {
        this.errorService.showApiError(err.error?.message, err.status);
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
