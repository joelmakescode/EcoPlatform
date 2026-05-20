import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DetailBoxComponent} from '../detail-box.component';
import {CasinoOverviewTransferMoneyType} from '../../../../client/models/casino/casino.model';
import {NumberInputComponent} from '../../number-input/number-input.component';
import {InfoTextComponent} from '../../info-text/info-text.component';

@Component({
  selector: 'app-casino-transfer-money-detail',
  imports: [
    DetailBoxComponent,
    NumberInputComponent,
    InfoTextComponent
  ],
  templateUrl: './casino-transfer-money-detail.component.html',
  styleUrl: './casino-transfer-money-detail.component.css',
})
export class CasinoTransferMoneyDetailComponent {
  @Input() title!: CasinoOverviewTransferMoneyType;
  @Input() infoText!: string;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirm: EventEmitter<number> = new EventEmitter<number>();

  value: number = 0;

  onValueChange(val: number): void {
    this.value = val;
  }

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit(this.value);
  }
}
