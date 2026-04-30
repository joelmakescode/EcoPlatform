import {Transaction} from './transaction.model';
import {TransactionPagination} from './transaction-pagination.model';

export interface TransactionResponse {
  id: number;
  transactions: Transaction[];
  pagination: TransactionPagination;
}
