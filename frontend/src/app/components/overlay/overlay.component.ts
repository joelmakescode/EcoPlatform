import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {ErrorToastComponent} from '../toasts/error-toast/error-toast.component';
import {SuccessToastComponent} from '../toasts/success-toast/success-toast.component';
import {TransactionModalService} from '../../client/services/transactions/transaction-modal.service';
import {RefreshService} from '../../client/services/refresh/refresh.service';
import {NavigationEnd, Router} from '@angular/router';
import {ToastService} from '../toasts/toastservice/toast.service';
import {filter, Observable} from 'rxjs';
import {
  TransactionDetailComponent
} from '../../pages/wallet/transactions/transaction-detail/transaction-detail.component';
import {Transaction} from '../../types/transaction/transaction.interface';

@Component({
  selector: 'app-overlay-components',
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorToastComponent,
    SuccessToastComponent,
    TransactionDetailComponent
  ],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.css',
})
export class OverlayComponent {
  private transactionModalService: TransactionModalService = inject(TransactionModalService);
  transaction$: Observable<Transaction | null> = this.transactionModalService.transaction$;

  constructor(refresh: RefreshService, router: Router, toastService: ToastService) {
    refresh.init();

    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      if (event.urlAfterRedirects.startsWith('/login') || event.urlAfterRedirects.startsWith('/register')) {
        toastService.setTopPosition(20);
      } else {
        toastService.setTopPosition(80);
      }
    })
  }

  onAccept(transaction: Transaction): void {
    this.transactionModalService.acceptTransaction(transaction);
    this.closeModal();
  }

  onCancel(transaction: Transaction): void {
    this.transactionModalService.cancelTransaction(transaction);
    this.closeModal();
  }

  onRefund(transaction: Transaction): void {
    this.transactionModalService.refundTransaction(transaction);
    this.closeModal();
  }

  onReject(transaction: Transaction): void {
    this.transactionModalService.rejectTransaction(transaction);
    this.closeModal();
  }

  closeModal(): void {
    this.transactionModalService.close();
  }
}
