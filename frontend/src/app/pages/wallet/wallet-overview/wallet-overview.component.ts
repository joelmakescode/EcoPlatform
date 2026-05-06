import {Component, inject, OnInit} from '@angular/core';
import {TileComponent} from '../../../component/shared/tile/tile.component';
import {DecimalPipe, NgIf} from '@angular/common';
import {TransactionService} from '../../../services/transactions/transaction.service';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';
import {Transaction, TransactionResponse} from '../../../client/models/transactions/transaction.model';

@Component({
  selector: 'app-wallet-overview',
  imports: [
    TileComponent,
    NgIf,
    DecimalPipe,
  ],
  templateUrl: './wallet-overview.component.html',
  styleUrl: './wallet-overview.component.css',
})
export class WalletOverviewComponent implements OnInit {
  private authTokenService = inject(AuthTokenService);
  private transactionService = inject(TransactionService);

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

  userId = this.authTokenService.getUserId();
  limit: number = 50;
  nextCursor: string | null = null;
  loading: boolean = false;

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;

    this.transactionService.getTransactions(this.userId, this.limit, this.nextCursor ?? undefined).subscribe(response => {
      this.transactions = response.transactions;
      this.nextCursor = response.pagination.next_cursor;
      this.openTransactions = response.transactions.filter((t: Transaction): boolean =>
        t.status === 'pending' && t.sender_id === this.userId
      ).length;
      this.loading = false;

      this.calculateForTileDisplay(response)
    })
  }

  calculateForTileDisplay(response: TransactionResponse): void {

    this.overallMoneyMadeLast30Days = response.transactions.filter((t: Transaction): boolean =>
      t.receiver_id === this.userId && t.status === 'completed' && isWithinLast30Days(t.created_at)
    ).reduce((sum: number, t: Transaction): number => sum + t.amount, 0) / 100;

    this.overallMoneyLostLast30Days = response.transactions.filter((t: Transaction): boolean =>
      t.sender_id === this.userId && t.status === 'completed' && isWithinLast30Days(t.created_at)
    ).reduce((sum: number, t: Transaction): number => sum + t.amount, 0) / 100;

    this.totalTransactions = response.transactions.filter((t: Transaction): boolean => t.status !== 'pending').length;

    this.moneySentCountLast30Days = response.transactions.filter(t =>
      t.sender_id === this.userId && t.type === 'send' && isWithinLast30Days(t.created_at)
    ).length;

    this.moneySentCountOverall = response.transactions.filter(t =>
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
}

function isWithinLast30Days(date: string | Date): boolean {
  const transactionDate = new Date(date).getTime();
  const now = Date.now();

  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

  return now - transactionDate <= thirtyDaysInMs;
}
