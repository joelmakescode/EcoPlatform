import {ChangeDetectorRef, Component, inject, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Transaction, TransactionResponse} from '../../../client/models/transactions/transaction.model';
import {TransactionService} from '../../../services/transactions/transaction.service';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';
import {ContentBoxComponent} from '../../../component/content-box/content-box.component';
import {BackLinkComponent} from '../../../component/shared/back-link/back-link.component';
import {
  TransactionsLayoutComponent
} from '../../../component/shared/layouts/transactions-layout/transactions-layout.component';
import {WebSocketService} from '../../../services/websocket/websocket.service';
import {Subscription} from 'rxjs';

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
export class TransactionsComponent implements OnInit, OnDestroy {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private tokenService: AuthTokenService = inject(AuthTokenService);
  private transactionService: TransactionService = inject(TransactionService);
  private webSocketService: WebSocketService = inject(WebSocketService);

  transactions: Transaction[] = [];
  userId: number | null = this.tokenService.getUserId();
  limit: number = 20;
  nextCursor: string | null = null;
  cursorStack: (string | null)[] = [null];
  isLoading: boolean = false;

  private websocketSubscription!: Subscription;

  ngOnInit(): void {
    this.loadTransactions();

    this.websocketSubscription = this.webSocketService.refresh$.subscribe(() => {
      this.handleWebSocketRefresh();
    })
  }

  ngOnDestroy(): void {
    this.websocketSubscription.unsubscribe();
  }

  loadTransactions(cursor: string | null = null): void {
    this.isLoading = true;

    this.transactionService
      .getTransactions(this.userId, this.limit, cursor ?? undefined)
      .subscribe((response: TransactionResponse): void => {
        this.transactions = response.transactions;
        this.nextCursor = response.pagination.next_cursor;
        this.isLoading = false;

        this.cdr.detectChanges();
      });
  }

  nextPage(): void {
    if (!this.nextCursor) return;

    this.cursorStack.push(this.nextCursor);
    this.loadTransactions(this.nextCursor);
  }

  previousPage(): void {
    if (this.cursorStack.length <= 1) return;

    this.cursorStack.pop();
    const previousCursor: string | null = this.cursorStack[this.cursorStack.length - 1];
    this.loadTransactions(previousCursor);
  }

  get isFirstPage(): boolean {
    return this.cursorStack.length <= 1;
  }

  get isLastPage(): boolean {
    return !this.nextCursor;
  }

  private handleWebSocketRefresh(): void {
    this.loadTransactions();
    this.cdr.detectChanges();
  }
}
