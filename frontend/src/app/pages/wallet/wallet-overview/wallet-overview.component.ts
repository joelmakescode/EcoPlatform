import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TileComponent} from '../../../shared/tile/tile.component';
import {DecimalPipe} from '@angular/common';
import {TransactionService} from '../../../client/services/transactions/transaction.service';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';
import {WebSocketService} from '../../../client/services/websocket/websocket.service';
import {Transaction, TransactionResponse} from '../../../types/transaction/transaction.interface';

@Component({
  selector: 'app-wallet-overview',
  imports: [
    TileComponent,
    DecimalPipe,
  ],
  templateUrl: './wallet-overview.component.html',
  styleUrl: './wallet-overview.component.css',
})
export class WalletOverviewComponent implements OnInit, OnDestroy {
  private authTokenService: AuthTokenService = inject(AuthTokenService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private transactionService: TransactionService = inject(TransactionService);
  private webSocketService: WebSocketService = inject(WebSocketService);

  openTransactions: number = 0;
  transactions: Transaction[] = [];

  overallMoneyMadeLast30Days: number = 0;
  overallMoneyLostLast30Days: number = 0;
  totalTransactions: number = 0;

  moneySentCountLast30Days: number = 0;
  moneySentCountOverall: number = 0;
  moneySentOverall: number = 0;

  requestsSentCountLast30Days: number = 0;
  requestsSentCountOverall: number = 0;
  moneyMadeThroughRequests: number = 0;

  userId: number | null = this.authTokenService.getUserId();
  limit: number = 50;
  nextCursor: string | null = null;
  loading: boolean = false;

  ngOnInit(): void {
    this.loadTransactions();

    window.addEventListener('websocket-refresh', this.handleWebSocketRefresh.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('websocket-refresh', this.handleWebSocketRefresh.bind(this));
  }

  loadTransactions(): void {
    this.loading = true;

    this.transactionService.getTransactions(this.userId, this.limit, this.nextCursor ?? undefined).subscribe(response => {
      this.transactions = response.transactions;
      this.nextCursor = response.pagination.next_cursor;
      this.openTransactions = response.transactions.filter((t: Transaction): boolean =>
        t.status === 'pending' && t.sender_id === this.userId
      ).length;
      this.loading = false;

      this.calculateForTileDisplay(response);
      this.cdr.detectChanges();
    })
  }

  private calculateForTileDisplay(response: TransactionResponse): void {

    this.overallMoneyMadeLast30Days = response.transactions.filter((t: Transaction): boolean =>
      t.receiver_id === this.userId && t.status === 'completed' && isWithinLast30Days(t.created_at)
    ).reduce((sum: number, t: Transaction): number => sum + t.amount, 0) / 100;

    this.overallMoneyLostLast30Days = response.transactions.filter((t: Transaction): boolean =>
      t.sender_id === this.userId && t.status === 'completed' && isWithinLast30Days(t.created_at)
    ).reduce((sum: number, t: Transaction): number => sum + t.amount, 0) / 100;

    this.totalTransactions = response.transactions.filter((t: Transaction): boolean => t.status !== 'pending').length;

    this.moneySentCountLast30Days = response.transactions.filter((t: Transaction): boolean =>
      t.sender_id === this.userId && t.type === 'send' && isWithinLast30Days(t.created_at)
    ).length;

    this.moneySentCountOverall = response.transactions.filter((t: Transaction): boolean =>
      t.sender_id === this.userId && t.type === 'send'
    ).length;

    this.moneySentOverall = response.transactions.filter((t: Transaction): boolean =>
      t.sender_id === this.userId && t.status === 'completed' && t.type === 'send'
    ).reduce((sum: number, t: Transaction): number => sum + t.amount, 0) / 100;

    this.requestsSentCountLast30Days = response.transactions.filter((t: Transaction): boolean =>
      t.receiver_id === this.userId && t.type === 'request' && isWithinLast30Days(t.created_at)
    ).length;

    this.requestsSentCountOverall = response.transactions.filter((t: Transaction): boolean =>
      t.receiver_id === this.userId && t.type === 'request'
    ).length;

    this.moneyMadeThroughRequests = response.transactions.filter((t: Transaction): boolean =>
      t.receiver_id === this.userId && t.type === 'request' && t.status === 'completed'
    ).reduce((sum: number, t: Transaction): number => sum + t.amount, 0) / 100;
  }

  private handleWebSocketRefresh(): void {
    this.loadTransactions();
  }
}

function isWithinLast30Days(date: string | Date): boolean {
  const transactionDate: number = new Date(date).getTime();
  const now: number = Date.now();

  const thirtyDaysInMs: number = 30 * 24 * 60 * 60 * 1000;

  return now - transactionDate <= thirtyDaysInMs;
}
