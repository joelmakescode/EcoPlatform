import {ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {ContentBoxComponent} from '../../../components/content-box/content-box.component';
import {BackLinkComponent} from '../../../shared/back-link/back-link.component';
import {AsyncPipe} from '@angular/common';
import {WebSocketService} from '../../../client/services/websocket/websocket.service';
import {Observable, Subscription} from 'rxjs';
import {CasinoService} from '../../../client/services/casino/casino.service';
import {DetailBoxComponent} from '../../../shared/detail-box/detail-box.component';
import {NumberInputComponent} from '../../../shared/number-input/number-input.component';
import {InfoTextComponent} from '../../../shared/info-text/info-text.component';
import {MessageService} from '../../../client/services/message/message.service';
import {Bets, CasinoBalance, RollADiceState} from '../../../types/casino/casino.interface';
import {CasinoStateService} from '../../../client/services/casino/casinostate.service';
import {RollADiceStateService} from '../../../client/services/casino/games/rolladice/rolladicestate.service';
import {RollADiceLiveService} from '../../../client/services/casino/games/rolladice/rolladicelive.service';

@Component({
  selector: 'app-roll-a-dice',
  standalone: true,
  imports: [
    ContentBoxComponent,
    BackLinkComponent,
    DetailBoxComponent,
    NumberInputComponent,
    InfoTextComponent,
    AsyncPipe,
  ],
  templateUrl: './roll-a-dice.component.html',
  styleUrl: './roll-a-dice.component.css',
})
export class RollADiceComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  private casinoService: CasinoService = inject(CasinoService);
  private casinoStatesService: CasinoStateService = inject(CasinoStateService);
  private messageService: MessageService = inject(MessageService);

  private stateService: RollADiceStateService = inject(RollADiceStateService);
  private liveService: RollADiceLiveService = inject(RollADiceLiveService);

  state$: Observable<RollADiceState> = this.stateService.state$;
  casinoBalance$: Observable<number> = this.casinoStatesService.casinoBalance$;
  casinoBalance: number = 0;

  depositAmount: number = 0;
  isModalOpen: boolean = false;
  clearMode: boolean = false;

  // CENT FORMAT FOR THE SAKE OF THE INTEGER OVERFLOW AND DATABASE
  currentStake: number = 10;
  stakeOptions: number[] = [20, 50, 100, 200, 500, 1000, 2500, 5000, 10000]
  bets: Bets = {};

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.initializeConnections();
  }

  ngOnDestroy(): void {
    this.bets = {};
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
    this.subscriptions = [];
  }

  submitBets(): void {
    this.casinoService.postBets(this.bets).subscribe();
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
    this.depositAmount = 0;
    this.isModalOpen = !this.isModalOpen;
  }

  closeDepositModal(): void {
    this.isModalOpen = !this.isModalOpen;
    this.close.emit();
  }

  confirmDeposit(): void {
    this.closeDepositModal();
    this.casinoService.postDepositBalance(this.depositAmount).subscribe({
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
    this.liveService.roundLockObservable$.subscribe((): void => {
      this.submitBets();
    });

    this.subscriptions.push(this.casinoBalance$.subscribe((balance: number): void => {
      this.casinoBalance = balance
      this.casinoStatesService.load();
    }))
  }
}
