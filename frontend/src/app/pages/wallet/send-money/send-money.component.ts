import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
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
import {interval, switchMap} from 'rxjs';
import {ErrorService} from '../../../services/messages/error/error.service';
import {SuccessService} from '../../../services/messages/success/success.service';

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
export class SendMoneyComponent implements OnInit {
  private tokenService = inject(AuthTokenService);
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);
  private errorService = inject(ErrorService);
  private successService = inject(SuccessService);

  transactions: Transaction[] = [];
  userId = this.tokenService.getUserId();
  limit = 20;

  isLoading = false;

  ngOnInit() {
    this.loadTransactions();

    interval(2000)
      .pipe(
        switchMap(() =>
          this.transactionService.getTransactions(this.userId, this.limit)
        )
      )
    .subscribe(response => {
      this.transactions = filterTransactions(response, this.userId);
      this.cdr.detectChanges();
    });
  }

  // TODO: Possible to outsource this method
  loadTransactions() {
    this.isLoading = true;

    this.transactionService
      .getTransactions(this.userId, this.limit, undefined)
      .subscribe(response => {
        this.transactions = filterTransactions(response, this.userId);
        this.isLoading = false;

        this.cdr.detectChanges();
      })
  }

  sendMoney(event: { username: string, amount: number }) {
    this.transactionService.sendMoneyTransaction(event.username, event.amount)
    .subscribe({
      next: tx => {
        this.successService.showApiSuccess("TRANSACTION_SENT_SUCCESSFUL");
      },
      error: err => {
        this.errorService.showApiError(err.error?.message, err.status);
      }
    })
  }

}

function filterTransactions(response: TransactionResponse, userId: number | null): Transaction[] {
  return response.transactions.filter((transaction: Transaction) =>
    transaction.type === 'send' && transaction.sender_id === userId
  );
}
