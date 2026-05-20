import {Component, EventEmitter, inject, Input, model, Output} from '@angular/core';
import {Transaction} from '../../../client/models/transactions/transaction.model';
import {AmountPipe} from '../../../pipes/transactions/amount.pipe';
import {TypePipe} from '../../../pipes/transactions/type.pipe';
import {StatusPipe} from '../../../pipes/transactions/status.pipe';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';
import {DatePipe, NgIf} from '@angular/common';
import {InfoTextComponent} from '../info-text/info-text.component';

@Component({
  selector: 'app-detail-box',
  standalone: true,
  templateUrl: './detail-box.component.html',
  styleUrl: './detail-box.component.css',
})
export class DetailBoxComponent {
  @Input() title!: string;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
