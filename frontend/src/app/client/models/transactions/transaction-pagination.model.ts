export interface TransactionPagination {
  limit: number;
  next_cursor: string | null;
  has_more: boolean;
}
