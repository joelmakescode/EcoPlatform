import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ContentBoxComponent} from '../../../component/content-box/content-box.component';
import {BackLinkComponent} from '../../../component/shared/back-link/back-link.component';
import {
  TransactionsInputLayoutComponent
} from '../../../component/shared/layouts/transactions-layout/transactions-input-layout/transactions-input-layout.component';
import {
  TransactionsLayoutComponent
} from '../../../component/shared/layouts/transactions-layout/transactions-layout.component';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';
import {TransactionService} from '../../../services/transactions/transaction.service';
import {Transaction, TransactionResponse} from '../../../client/models/transactions/transaction.model';
import {SuccessService} from '../../../services/messages/success/success.service';
import {ErrorService} from '../../../services/messages/error/error.service';
import {WebSocketService} from '../../../services/websocket/websocket.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-request-money',
  standalone: true,
  imports: [
    ContentBoxComponent,
    BackLinkComponent,
    TransactionsInputLayoutComponent,
    TransactionsLayoutComponent
  ],
  templateUrl: './request-money.component.html',
  styleUrl: './request-money.component.css',
})
export class RequestMoneyComponent implements OnInit, OnDestroy {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private errorService: ErrorService = inject(ErrorService);
  private successService: SuccessService = inject(SuccessService);
  private tokenService: AuthTokenService = inject(AuthTokenService);
  private transactionService: TransactionService = inject(TransactionService);
  private webSocketService: WebSocketService = inject(WebSocketService);

  private websocketSubscription!: Subscription;

  transactions: Transaction[] = [];
  userId: number | null = this.tokenService.getUserId();
  limit: number = 20;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadTransactions();

    this.websocketSubscription = this.webSocketService.refresh$.subscribe((): void => {
      this.loadTransactions();
    });
  }

  ngOnDestroy(): void {
    this.websocketSubscription.unsubscribe();
  }

  loadTransactions(): void {
    this.isLoading = true;

    this.transactionService.getTransactions(this.userId, this.limit, undefined)
      .subscribe((response: TransactionResponse): void => {
        this.isLoading = false;
        this.transactions = filterTransactions(response, this.userId);
        this.cdr.detectChanges();
      })
  }

  requestMoneyTransaction(event: { username: string, amount: number }): void {
    this.transactionService.requestMoneyTransaction(event.username, event.amount)
      .subscribe({
        next: (): void => {
          this.successService.showApiSuccess("REQUEST_SENT_SUCCESSFUL");
        },
        error: (err: any): void => {
          this.errorService.showApiError(err.error?.message, err.status);
        }
      })
  }
}

function filterTransactions(response: TransactionResponse, userId: number | null): Transaction[] {
  return response.transactions.filter((transaction: Transaction): boolean =>
    transaction.receiver_id === userId && transaction.type === "request"
  );
}
