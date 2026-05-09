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

export interface TransactionResponse {
  id: number;
  transactions: Transaction[];
  pagination: TransactionPagination;
}

export interface TransactionPagination {
  limit: number;
  next_cursor: string | null;
  has_more: boolean;
}

export type TransactionStatus = 'pending' | 'completed' | 'rejected' | 'cancelled' | 'refund' ;
export type TransactionType = 'request' | 'send';
