import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {Transaction} from '../../../client/models/transactions/transaction.model';
import {TransactionService} from '../../../services/transactions/transaction.service';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';
import {filter, interval, switchMap} from 'rxjs';
import {ContentBoxComponent} from '../../../component/content-box/content-box.component';
import {BackLinkComponent} from '../../../component/shared/back-link/back-link.component';
import {
  TransactionsLayoutComponent
} from '../../../component/shared/layouts/transactions-layout/transactions-layout.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    ContentBoxComponent,
    BackLinkComponent,
    TransactionsLayoutComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  private tokenService = inject(AuthTokenService);
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);

  transactions: Transaction[] = [];

  userId = this.tokenService.getUserId();
  limit = 20;

  nextCursor: string | null = null;
  cursorStack: (string | null)[] = [null];

  isLoading = false;

  ngOnInit() {
    this.loadTransactions();

    interval(2000)
      .pipe(
        filter(() => !this.isLoading && this.isFirstPage),
        switchMap(() =>
          this.transactionService.getTransactions(this.userId, this.limit)
        )
      )
      .subscribe(res => {
        if (!res?.transactions) return;

        this.transactions = res.transactions;
        this.nextCursor = res.pagination.next_cursor;
        this.cdr.detectChanges();
      });
  }

  loadTransactions(cursor: string | null = null) {
    this.isLoading = true;

    this.transactionService
      .getTransactions(this.userId, this.limit, cursor ?? undefined)
      .subscribe(response => {
        this.transactions = response.transactions;
        this.nextCursor = response.pagination.next_cursor;
        this.isLoading = false;

        this.cdr.detectChanges();
      });
  }

  nextPage() {
    if (!this.nextCursor) return;

    this.cursorStack.push(this.nextCursor);
    this.loadTransactions(this.nextCursor);
  }

  previousPage() {
    if (this.cursorStack.length <= 1) return;

    this.cursorStack.pop();
    const previousCursor = this.cursorStack[this.cursorStack.length - 1];
    this.loadTransactions(previousCursor);
  }

  get isFirstPage(): boolean {
    return this.cursorStack.length <= 1;
  }

  get isLastPage(): boolean {
    return !this.nextCursor;
  }
}
