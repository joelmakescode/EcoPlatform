import {Component, inject} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {ErrorToastComponent} from '../shared/toasts/error-toast/error-toast.component';
import {SuccessToastComponent} from '../shared/toasts/success-toast/success-toast.component';
import {TransactionModalService} from '../../services/transactions/transaction-modal.service';
import {RefreshService} from '../../services/refresh/refresh.service';
import {NavigationEnd, Router} from '@angular/router';
import {ToastService} from '../shared/toasts/toastservice/toast.service';
import {filter} from 'rxjs';
import {Transaction} from '../../client/models/transactions/transaction.model';
import {
  TransactionDetailComponent
} from '../../pages/wallet/transactions/transaction-detail/transaction-detail.component';

@Component({
  selector: 'app-overlay-components',
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorToastComponent,
    NgIf,
    SuccessToastComponent,
    TransactionDetailComponent
  ],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.css',
})
export class OverlayComponent {
  private transactionModalService = inject(TransactionModalService);
  transaction$ = this.transactionModalService.transaction$;

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

  onAccept(transaction: Transaction) {
    this.transactionModalService.acceptTransaction(transaction);
    this.closeModal();
  }

  onCancel(transaction: Transaction) {
    this.transactionModalService.cancelTransaction(transaction);
    this.closeModal();
  }

  onRefund(transaction: Transaction) {
    this.transactionModalService.refundTransaction(transaction);
    this.closeModal();
  }

  onReject(transaction: Transaction) {
    this.transactionModalService.rejectTransaction(transaction);
    this.closeModal();
  }

  closeModal() {
    this.transactionModalService.close();
  }
}
