import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TileComponent} from '../../../shared/tile/tile.component';
import {CasinoService} from '../../../client/services/casino/casino.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {DetailBoxComponent} from '../../../shared/detail-box/detail-box.component';
import {
  CasinoTransferMoneyDetailComponent
} from '../../../shared/detail-box/casino-transfer-money-detail/casino-transfer-money-detail.component';
import {MessageService} from '../../../client/services/message/message.service';
import {CasinoStatesService} from '../../../client/services/casino/casinostates.service';
import {Observable} from 'rxjs';
import {WebSocketService} from '../../../client/services/websocket/websocket.service';
import {
  CasinoOverviewTransferMoneyInfoMessages,
  CasinoOverviewTransferMoneyType
} from '../../../types/casino/casino.enum';

@Component({
  selector: 'app-casino-overview',
  standalone: true,
  imports: [
    TileComponent,
    DetailBoxComponent,
    NgIf,
    CasinoTransferMoneyDetailComponent,
    AsyncPipe,
  ],
  templateUrl: './casino-overview.component.html',
  styleUrl: './casino-overview.component.css',
})
export class CasinoOverviewComponent implements OnInit, OnDestroy {
  private casinoService: CasinoService = inject(CasinoService);
  private casinoStatesService: CasinoStatesService = inject(CasinoStatesService);
  private messageService: MessageService = inject(MessageService);
  private websocketService: WebSocketService = inject(WebSocketService);

  casinoBalance$: Observable<number> = this.casinoStatesService.casinoBalance$;

  isInfoModalOpen: boolean = false;
  isDepositModalOpen: boolean = false;
  isCashOutModalOpen: boolean = false;

  depositMoney: CasinoOverviewTransferMoneyType = CasinoOverviewTransferMoneyType.DEPOSIT_MONEY;
  cashOutMoney: CasinoOverviewTransferMoneyType = CasinoOverviewTransferMoneyType.CASH_OUT_MONEY;

  depositMoneyInfoText: string = CasinoOverviewTransferMoneyInfoMessages[this.depositMoney];
  cashOutMoneyInfoText: string = CasinoOverviewTransferMoneyInfoMessages[this.cashOutMoney]


  ngOnInit(): void {
    this.casinoStatesService.load();
    this.handleWebsocketConnection();
  }

  ngOnDestroy(): void {}

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
        },
        error: (err: any): void => {
          this.messageService.error({ message: "Casino Cashout failed" });
        }
      })
    }
  }

  private handleWebsocketConnection(): void {
    this.websocketService.connect();
    this.websocketService.refresh$.subscribe((): void => {
      this.casinoStatesService.load();
    });
  }
}
