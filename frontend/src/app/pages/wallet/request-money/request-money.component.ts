import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
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
import {Transaction} from '../../../client/models/transactions/transaction.model';
import {TransactionResponse} from '../../../client/models/transactions/transaction-response.model';
import {interval, switchMap, take} from 'rxjs';
import {response} from 'express';
import {SuccessService} from '../../../services/messages/success/success.service';
import {ErrorService} from '../../../services/messages/error/error.service';

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
export class RequestMoneyComponent implements OnInit {
  private tokenService = inject(AuthTokenService);
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);
  private successService = inject(SuccessService);
  private errorService = inject(ErrorService);

  transactions: Transaction[] = [];
  userId = this.tokenService.getUserId();
  limit = 20;
  isLoading = false;

  ngOnInit() {
    this.loadTransactions();

    interval(2000)
      .pipe(
        switchMap(() =>
          this.transactionService.getTransactions(this.userId, this.limit, undefined)
        )
      )
    .subscribe(response => {
      this.transactions = filterTransactions(response, this.userId);

      this.cdr.detectChanges();
    })
  }

  loadTransactions() {
    this.isLoading = true;

    this.transactionService
      .getTransactions(this.userId, this.limit, undefined)
      .subscribe(response => {
        this.isLoading = false;
        this.transactions = filterTransactions(response, this.userId);

        this.cdr.detectChanges();
      })
  }

  requestMoneyTransaction(event: { username: string, amount: number }) {
    this.transactionService.requestMoneyTransaction(event.username, event.amount)
      .subscribe({
        next: tx => {
          this.successService.showApiSuccess("REQUEST_SENT_SUCCESSFUL");
        },
        error: err => {
          this.errorService.showApiError(err.error?.message, err.status);
        }
      })
  }
}

function filterTransactions(response: TransactionResponse, userId: number | null): Transaction[] {
  return response.transactions.filter((transaction: Transaction) =>
    transaction.receiver_id === userId && transaction.type === "request"
  );
}
