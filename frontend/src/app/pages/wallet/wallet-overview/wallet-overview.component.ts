import {Component, inject, OnInit} from '@angular/core';
import {TileComponent} from '../../../component/shared/tile/tile.component';
import {NgIf} from '@angular/common';
import {TransactionService} from '../../../services/transactions/transaction.service';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';
import {Transaction, TransactionResponse} from '../../../client/models/transactions/transaction.model';

@Component({
  selector: 'app-wallet-overview',
  imports: [
    TileComponent,
    NgIf
  ],
  templateUrl: './wallet-overview.component.html',
  styleUrl: './wallet-overview.component.css',
})
export class WalletOverviewComponent implements OnInit {
  private authTokenService = inject(AuthTokenService);
  private transactionService = inject(TransactionService);

  openTransactions: number = 0;
  transactions: Transaction[] = [];
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
      this.openTransactions = countPendingTransactions(response, this.userId);
      this.loading = false;
    })
  }
}

function countPendingTransactions(response: TransactionResponse, userId: number | null): number {
  let count: number = 0;

  for (const transaction of response.transactions) {
    if (transaction.status === 'pending' && transaction.sender_id === userId) {
      count++;
    }
  }

  return count;
}
