import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Transaction} from '../../client/models/transactions/transaction.model';
import {TransactionService} from './transaction.service';
import {MessageService} from '../messages/message.service';

@Injectable({ providedIn: 'root' })
export class TransactionModalService {
  private transactionService: TransactionService = inject(TransactionService);
  private messageService: MessageService = inject(MessageService);
  private transactionSubject: BehaviorSubject<Transaction | null> = new BehaviorSubject<Transaction | null>(null);

  transaction$: Observable<Transaction | null> = this.transactionSubject.asObservable();

  open(transaction: Transaction): void {
    this.transactionSubject.next(transaction);
  }

  close(): void {
    this.transactionSubject.next(null);
  }

  acceptTransaction(transaction: Transaction): void {
    this.transactionService.acceptTransaction(transaction.id).subscribe({
      next: (): void => {
        this.messageService.success({ message: "Transaction accepted" });
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Couldn't accept transaction" });
        // error log service
      }
    })
  }

  cancelTransaction(transaction: Transaction): void {
    this.transactionService.cancelTransaction(transaction.id).subscribe({
      next: (): void => {
        this.messageService.success({ message: "Transaction cancelled" });
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Couldn't cancel transaction" });
        // error log service
      }
    })
  }

  refundTransaction(transaction: Transaction): void {
    this.transactionService.refundTransaction(transaction.id).subscribe({
      next: (): void => {
        this.messageService.success({ message: "Transaction refunded" });
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Couldn't refund transaction" });
        // error log service
      }
    })
  }

  rejectTransaction(transaction: Transaction): void {
    this.transactionService.rejectTransaction(transaction.id).subscribe({
      next: (): void => {
        this.messageService.success({ message: "Transaction rejected" });
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Couldn't reject transaction" });
        // error log service
      }
    })
  }
}
