import {TransactionStatus, TransactionType} from './transaction-status.type';

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
