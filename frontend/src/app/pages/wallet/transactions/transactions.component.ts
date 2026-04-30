import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Transaction} from '../../../client/models/transactions/transaction.model';
import {TransactionService} from '../../../services/transactions/transaction.service';
import {DatePipe, NgClass, NgForOf, NgOptimizedImage} from '@angular/common';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';
import {AmountPipe} from '../../../pipes/transactions/amount.pipe';
import {TypePipe} from '../../../pipes/transactions/type.pipe';
import {StatusPipe} from '../../../pipes/transactions/status.pipe';
import {interval, switchMap} from 'rxjs';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    NgForOf,
    AmountPipe,
    TypePipe,
    StatusPipe,
    NgClass,
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
  username = localStorage.getItem("identity");
  limit = 20;

  nextCursor: string | null = null;
  cursorStack: (string | null)[] = [null];

  isLoading = false;

  ngOnInit() {
    this.loadTransactions();

    interval(2000)
      .pipe(
        switchMap(() =>
          this.transactionService.getTransactions(this.userId, this.limit)
        )
      )
      .subscribe(res => { this.transactions = res.transactions; this.cdr.detectChanges(); });
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

  trackByTxId(_: number, tx: Transaction) {
    return tx.id;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'status--success';
      case 'pending':
        return 'status--pending';
      case 'cancelled':
      case 'rejected':
        return 'status--error';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'assets/icon_success.png';
      case 'pending':
        return 'assets/icon_pending.png';
      case 'cancelled':
      case 'rejected':
        return 'assets/icon_error.png';
      default:
        return '';
    }
  }
}
