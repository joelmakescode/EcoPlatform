import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {DetailBoxComponent} from '../../../../component/shared/detail-box/detail-box.component';
import {AmountPipe} from '../../../../pipes/transactions/amount.pipe';
import {DatePipe, NgIf} from '@angular/common';
import {InfoTextComponent} from '../../../../component/shared/info-text/info-text.component';
import {StatusPipe} from '../../../../pipes/transactions/status.pipe';
import {TypePipe} from '../../../../pipes/transactions/type.pipe';
import {Transaction} from '../../../../client/models/transactions/transaction.model';
import {AuthTokenService} from '../../../../services/auth-token/auth-token.service';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [
    DetailBoxComponent,
    AmountPipe,
    DatePipe,
    InfoTextComponent,
    NgIf,
    StatusPipe,
    TypePipe
  ],
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.css',
})
export class TransactionDetailComponent {
  @Output() close = new EventEmitter<void>();

  @Input() transaction: Transaction | null = null;

  @Output() accept = new EventEmitter<Transaction>();
  @Output() cancel = new EventEmitter<Transaction>();
  @Output() refund = new EventEmitter<Transaction>();
  @Output() reject = new EventEmitter<Transaction>();

  private authTokenService = inject(AuthTokenService);
  userId = this.authTokenService.getUserId();

  get canAcceptOrReject(): boolean {
    const tx = this.transaction;
    return !!tx && tx.type === 'request' && tx.status === 'pending' && tx.sender_id === this.userId;
  }

  get canCancel(): boolean {
    const tx = this.transaction;
    return !!tx && tx.type === 'request' && tx.status === 'pending' && tx.receiver_id === this.userId;
  }

  get canRefund(): boolean {
    const tx = this.transaction;
    if (!tx) return false;

    if (tx.type !== 'send' || tx.sender_id !== this.userId) {
      return false;
    }

    const createdAt = new Date(tx.created_at).getTime();
    const now = Date.now();

    const secondsPassed = 24 * 60 * 60 * 1000;

    return now - createdAt <= secondsPassed;
  }

  get showCancelledInfoText(): boolean {
    return this.transaction?.status === 'cancelled' && this.transaction.receiver_id === this.userId;
  }

  get showRefundNotAvailableInfoText(): boolean {
    const valid = this.canRefund;
    return !valid && this.transaction?.type === 'send' && this.transaction?.sender_id === this.userId;
  }

  get showRefundedInfoText(): boolean {
    return this.transaction?.type === 'refund' && this.transaction.sender_id === this.userId;
  }

  get showRejectedReceiverInfoText(): boolean {
    return this.transaction?.status === 'rejected' && this.transaction.receiver_id === this.userId;
  }

  get showRejectedSenderInfoText(): boolean {
    return this.transaction?.status === 'rejected' && this.transaction.sender_id === this.userId;
  }

  onClose(): void {
    this.close.emit();
  }
}
