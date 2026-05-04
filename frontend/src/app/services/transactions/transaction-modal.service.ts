import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Transaction} from '../../client/models/transactions/transaction.model';
import {TransactionService} from './transaction.service';
import {ErrorService} from '../messages/error/error.service';
import {SuccessService} from '../messages/success/success.service';

@Injectable({ providedIn: 'root' })
export class TransactionModalService {
  private transactionService = inject(TransactionService);
  private errorService = inject(ErrorService);
  private successService = inject(SuccessService);
  private transactionSubject = new BehaviorSubject<Transaction | null>(null);

  transaction$ = this.transactionSubject.asObservable();

  open(transaction: Transaction) {
    this.transactionSubject.next(transaction);
  }

  close() {
    this.transactionSubject.next(null);
  }

  acceptTransaction(transaction: Transaction) {
    this.transactionService.acceptTransaction(transaction.id).subscribe({
      next: () => {
        this.successService.showApiSuccess("ACCEPT_TRANSACTION_SUCCESSFUL")
      },
      error: err => {
        this.errorService.showApiError(err.error?.message, err.status);
      }
    })
  }

  cancelTransaction(transaction: Transaction) {
    this.transactionService.cancelTransaction(transaction.id).subscribe({
      next: () => {
        this.successService.showApiSuccess("CANCEL_TRANSACTION_SUCCESSFUL");
      },
      error: err => {
        this.errorService.showApiError(err.error?.message, err.status);
      }
    })
  }

  rejectTransaction(transaction: Transaction) {
    this.transactionService.rejectTransaction(transaction.id).subscribe({
      next: () => {
        this.successService.showApiSuccess("REJECT_TRANSACTION_SUCCESSFUL");
      },
      error: err => {
        this.errorService.showApiError(err.error?.message, err.status);
      }
    })
  }
}
