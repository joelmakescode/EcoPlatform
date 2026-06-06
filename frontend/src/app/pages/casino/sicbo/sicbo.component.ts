import {Component, DestroyRef, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {ContentBoxComponent} from '../../../components/content-box/content-box.component';
import {BackLinkComponent} from '../../../shared/back-link/back-link.component';
import {AsyncPipe} from '@angular/common';
import {filter, Observable, Subscription} from 'rxjs';
import {CasinoService} from '../../../client/services/casino/casino.service';
import {DetailBoxComponent} from '../../../shared/detail-box/detail-box.component';
import {NumberInputComponent} from '../../../shared/number-input/number-input.component';
import {InfoTextComponent} from '../../../shared/info-text/info-text.component';
import {MessageService} from '../../../client/services/message/message.service';
import {Bets, RollADiceState} from '../../../types/casino/casino.interface';
import {CasinoStateService} from '../../../client/services/casino/casinostate.service';
import {RollADiceStateService} from '../../../client/services/casino/games/rolladice/rolladicestate.service';
import {RollADiceLiveService} from '../../../client/services/casino/games/rolladice/rolladicelive.service';
import {
  CasinoTransferMoneyDetailComponent
} from '../../../shared/detail-box/casino-transfer-money-detail/casino-transfer-money-detail.component';
import {
  CasinoOverviewTransferMoneyInfoMessages,
  CasinoOverviewTransferMoneyType
} from '../../../types/casino/casino.enum';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BalancePipe} from '../../../pipes/balance.pipe';

@Component({
  selector: 'app-sic-bo',
  standalone: true,
  imports: [
    ContentBoxComponent,
    BackLinkComponent,
    AsyncPipe,
    CasinoTransferMoneyDetailComponent,
    BalancePipe,
  ],
  templateUrl: './sicbo.component.html',
  styleUrl: './sicbo.component.css',
})
export class SicboComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  private casinoService: CasinoService = inject(CasinoService);
  private casinoStatesService: CasinoStateService = inject(CasinoStateService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private messageService: MessageService = inject(MessageService);

  private stateService: RollADiceStateService = inject(RollADiceStateService);
  private liveService: RollADiceLiveService = inject(RollADiceLiveService);

  state$: Observable<RollADiceState> = this.stateService.state$;
  casinoBalance$: Observable<number> = this.casinoStatesService.casinoBalance$;
  casinoBalance: number = 0;

  depositMoney: CasinoOverviewTransferMoneyType = CasinoOverviewTransferMoneyType.DEPOSIT_MONEY;
  depositMoneyInfoText: string = CasinoOverviewTransferMoneyInfoMessages[this.depositMoney];

  isModalOpen: boolean = false;
  clearMode: boolean = false;

  // CENT FORMAT FOR THE SAKE OF THE INTEGER OVERFLOW AND DATABASE
  currentStake: number = 10;
  stakeOptions: number[] = [20, 50, 100, 200, 500, 1000, 2500, 5000, 10000]
  bets: Bets = {};


  ngOnInit(): void {
    this.initializeConnections();
  }

  ngOnDestroy(): void {
    this.bets = {};
  }

  submitBets(): void {
    this.casinoService.postBets(this.bets).subscribe({
      next: (): void => {
        this.casinoStatesService.load();
      }, error: (): void => {
        this.messageService.error({ message: 'Sending Bet failed' });
      }
    });
  }

  selectStake(value: number): void {
    this.clearMode = false;

    this.stakeOptions.push(this.currentStake);
    this.stakeOptions = this.stakeOptions.filter((v: number): boolean => v !== value);

    this.currentStake = value;
    this.stakeOptions.sort((a: number, b: number): number => a - b);
  }

  placeBet(key: string, isLocked: boolean): void {
    if (isLocked) {
      return;
    }

    if (this.clearMode) {
      this.clearBet(key);
      return;
    }

    if (!this.bets[key]) {
      this.bets[key] = 0;
    }

    if (this.getAvailableBalance() <= 0) {
      this.currentStake = 0;
      return;
    }

    if (this.currentStake > this.getAvailableBalance()) {
      this.adjustCurrentStake();
    }

    if (this.currentStake <= 0 || this.currentStake > this.getAvailableBalance()) {
      return;
    }

    this.bets[key] += this.currentStake;

    this.adjustCurrentStake();
  }

  getBetAmount(key: string): string {
    return this.bets[key] ? (this.bets[key] / 100).toFixed(2) : '';
  }

  getUsedBalance(): number {
    return Object.values(this.bets).reduce((sum: number, val: number): any => sum + val, 0);
  }

  getAvailableBalance(): number {
    return this.casinoBalance - this.getUsedBalance();
  }

  isStakeAvailable(stake: number): boolean {
    return stake <= this.getAvailableBalance();
  }

  adjustCurrentStake(): void {
    const available: number = this.getAvailableBalance();

    if (available <= 0) {
      if (this.currentStake > 0) {
        this.stakeOptions.push(this.currentStake);
      }

      this.currentStake = 0;
      this.stakeOptions = [...new Set(this.stakeOptions)].sort((a: number, b: number): number => a - b);
      return;
    }

    if (this.currentStake <= available) {
      return;
    }

    const oldStake: number =  this.currentStake;
    const validStakes: number[] = this.stakeOptions.filter((s: number): boolean => s <= available).sort((a: number, b: number): number => b - a);
    const newStake: number = validStakes.length ? validStakes[0] : 0;

    if (oldStake > 0) {
      this.stakeOptions.push(oldStake);
    }

    this.stakeOptions = this.stakeOptions.filter((s: number): boolean => s !== newStake)
    this.currentStake = newStake;

    this.stakeOptions = [...new Set(this.stakeOptions)].sort((a: number, b: number): number => a - b);
  }

  insufficientBalance(): boolean {
    return this.casinoBalance > 0;
  }

  toggleClearMode(): void {
    this.clearMode = !this.clearMode;
  }

  clearBets(): void {
    this.bets = {};
    this.adjustCurrentStake();
  }

  clearBet(key: string): void {
    delete this.bets[key];
  }

  openDepositModal(): void {
    this.isModalOpen = !this.isModalOpen;
  }

  closeDepositModal(): void {
    this.isModalOpen = !this.isModalOpen;
    this.close.emit();
  }

  confirmDeposit(amount: number): void {
    this.closeDepositModal();
    this.casinoService.postDepositBalance(amount).subscribe({
      next: (): void => {
        this.messageService.success({ message: "Casino Balance deposit successful" });
        this.casinoStatesService.load();
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Couldn't deposit Casino Balance" });
      }
    });
  }

  private initializeConnections(): void {
    this.casinoStatesService.load();
    this.liveService.roundLockObservable$
      .pipe(
        filter((): boolean => Object.keys(this.bets).length > 0),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((): void => {
        this.submitBets();
      });

    this.casinoBalance$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((balance: number): void => {
        this.casinoBalance = balance;
      })
  }
}
