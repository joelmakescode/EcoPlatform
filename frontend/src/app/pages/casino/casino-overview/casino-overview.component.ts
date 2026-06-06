import {Component, inject, OnInit} from '@angular/core';
import {CasinoService} from '../../../client/services/casino/casino.service';
import {AsyncPipe} from '@angular/common';
import {
  CasinoTransferMoneyDetailComponent
} from '../../../shared/detail-box/casino-transfer-money-detail/casino-transfer-money-detail.component';
import {MessageService} from '../../../client/services/message/message.service';
import {Observable} from 'rxjs';
import {
  CasinoOverviewTransferMoneyInfoMessages,
  CasinoOverviewTransferMoneyType
} from '../../../types/casino/casino.enum';
import {ContentBoxComponent} from '../../../components/content-box/content-box.component';
import {CasinoGameTileComponent} from '../../../components/casino/casino-game-tile/casino-game-tile.component';
import {CasinoStateService} from '../../../client/services/casino/casinostate.service';
import {RollADiceState} from '../../../types/casino/casino.interface';
import {RollADiceStateService} from '../../../client/services/casino/games/rolladice/rolladicestate.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RollADiceLiveService} from '../../../client/services/casino/games/rolladice/rolladicelive.service';
import {BalancePipe} from '../../../pipes/balance.pipe';

@Component({
  selector: 'app-casino-overview',
  standalone: true,
  imports: [
    CasinoTransferMoneyDetailComponent,
    AsyncPipe,
    ContentBoxComponent,
    CasinoGameTileComponent,
    BalancePipe,
  ],
  templateUrl: './casino-overview.component.html',
  styleUrl: './casino-overview.component.css',
})
export class CasinoOverviewComponent implements OnInit {
  private casinoService: CasinoService = inject(CasinoService);
  private casinoStatesService: CasinoStateService = inject(CasinoStateService);
  private liveService: RollADiceLiveService = inject(RollADiceLiveService);
  private messageService: MessageService = inject(MessageService);
  private rollADiceStateService: RollADiceStateService = inject(RollADiceStateService);

  casinoBalance$: Observable<number> = this.casinoStatesService.casinoBalance$;
  state$: Observable<RollADiceState> = this.rollADiceStateService.state$;

  isDepositModalOpen: boolean = false;
  isCashOutModalOpen: boolean = false;

  depositMoney: CasinoOverviewTransferMoneyType = CasinoOverviewTransferMoneyType.DEPOSIT_MONEY;
  cashOutMoney: CasinoOverviewTransferMoneyType = CasinoOverviewTransferMoneyType.CASH_OUT_MONEY;

  depositMoneyInfoText: string = CasinoOverviewTransferMoneyInfoMessages[this.depositMoney];
  cashOutMoneyInfoText: string = CasinoOverviewTransferMoneyInfoMessages[this.cashOutMoney]

  ngOnInit(): void {
    this.casinoStatesService.load();
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
          this.casinoStatesService.load();
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
          this.casinoStatesService.load();
        },
        error: (err: any): void => {
          this.messageService.error({ message: "Casino Cashout failed" });
        }
      })
    }
  }
}
