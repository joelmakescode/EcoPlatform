import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TileComponent} from '../../../component/shared/tile/tile.component';
import {CasinoService} from '../../../services/casino/casino.service';
import {
  CasinoBalance,
  CasinoOverviewTransferMoneyInfoMessages,
  CasinoOverviewTransferMoneyType
} from '../../../client/models/casino/casino.model';
import {NgIf} from '@angular/common';
import {DetailBoxComponent} from '../../../component/shared/detail-box/detail-box.component';
import {
  CasinoTransferMoneyDetailComponent
} from '../../../component/shared/detail-box/casino-transfer-money-detail/casino-transfer-money-detail.component';
import {MessageService} from '../../../services/messages/message.service';

@Component({
  selector: 'app-casino-overview',
  standalone: true,
  imports: [
    TileComponent,
    DetailBoxComponent,
    NgIf,
    CasinoTransferMoneyDetailComponent,
  ],
  templateUrl: './casino-overview.component.html',
  styleUrl: './casino-overview.component.css',
})
export class CasinoOverviewComponent implements OnInit, OnDestroy {
  private casinoService: CasinoService = inject(CasinoService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private messageService: MessageService = inject(MessageService);

  casinoBalance: number = 0;
  isInfoModalOpen: boolean = false;
  isDepositModalOpen: boolean = false;
  isCashOutModalOpen: boolean = false;

  depositMoney: CasinoOverviewTransferMoneyType = CasinoOverviewTransferMoneyType.DEPOSIT_MONEY;
  cashOutMoney: CasinoOverviewTransferMoneyType = CasinoOverviewTransferMoneyType.CASH_OUT_MONEY;

  depositMoneyInfoText: string = CasinoOverviewTransferMoneyInfoMessages[this.depositMoney];
  cashOutMoneyInfoText: string = CasinoOverviewTransferMoneyInfoMessages[this.cashOutMoney]

  private bindWebSocketRefresh: () => void = this.handleWebSocketRefresh.bind(this);

  ngOnInit() {
    this.loadBalance();
    window.addEventListener("websocket-refresh", this.bindWebSocketRefresh);
  }

  ngOnDestroy() {
    window.removeEventListener('websocket-refresh', this.bindWebSocketRefresh);
  }

  loadBalance(): void {
    this.casinoService.getBalance().subscribe((response: CasinoBalance): void => {
      this.casinoBalance = response.balance;
      this.cdr.detectChanges();
    })
  }

  infoModal(): void {
    this.isInfoModalOpen = !this.isInfoModalOpen;
  }

  depositModal(): void {
    this.isDepositModalOpen = !this.isDepositModalOpen;
  }

  cashOutModal(): void {
    this.isCashOutModalOpen = !this.isCashOutModalOpen;
  }

  confirm(amount: number): void {
    if (this.isDepositModalOpen) {
      this.depositModal();
      this.casinoService.postDepositBalance(amount).subscribe({
        next: (): void => {
          this.messageService.success({ message: "Casino Deposit successful" });

          window.dispatchEvent(new Event('websocket-refresh'));
        },
        error: (err: any): void => {
          this.messageService.error({ message: "Casino Deposit failed" });
        }
      });
    } else if (this.isCashOutModalOpen) {
      this.cashOutModal();
      this.casinoService.postCashoutBalance(amount).subscribe({
        next: (): void => {
          this.messageService.success({ message: "Casino Cashout successful" });

          window.dispatchEvent(new Event('websocket-refresh'));
        },
        error: (err: any): void => {
          this.messageService.error({ message: "Casino Cashout failed" });
        }
      })
    }
  }

  private handleWebSocketRefresh(): void {
    this.loadBalance();
    this.cdr.detectChanges();
  }
}
