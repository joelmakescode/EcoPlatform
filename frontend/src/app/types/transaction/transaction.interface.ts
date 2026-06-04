import {TransactionStatus, TransactionType} from './transaction.type';

export interface Transaction {
  id: string;
  sender_id: number;
  sender_username: string;
  receiver_id: number;
  receiver_username: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  created_at: string;
}

export interface TransactionPagination {
  limit: number;
  next_cursor: string | null;
  has_more: boolean;
}

export interface TransactionResponse {
  id: number;
  transactions: Transaction[];
  pagination: TransactionPagination;
}
