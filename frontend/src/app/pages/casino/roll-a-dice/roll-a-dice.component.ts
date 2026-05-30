import {ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {ContentBoxComponent} from '../../../component/content-box/content-box.component';
import {BackLinkComponent} from '../../../component/shared/back-link/back-link.component';
import {NgForOf, NgIf} from '@angular/common';
import {WebSocketService} from '../../../services/websocket/websocket.service';
import {Subscription} from 'rxjs';
import {Bets, CasinoBalance} from '../../../client/models/casino/casino.model';
import {CasinoService} from '../../../services/casino/casino.service';
import {DetailBoxComponent} from '../../../component/shared/detail-box/detail-box.component';
import {NumberInputComponent} from '../../../component/shared/number-input/number-input.component';
import {InfoTextComponent} from '../../../component/shared/info-text/info-text.component';
import {MessageService} from '../../../services/messages/message.service';

@Component({
  selector: 'app-roll-a-dice',
  standalone: true,
  imports: [
    ContentBoxComponent,
    BackLinkComponent,
    NgIf,
    NgForOf,
    DetailBoxComponent,
    NumberInputComponent,
    InfoTextComponent,
  ],
  templateUrl: './roll-a-dice.component.html',
  styleUrl: './roll-a-dice.component.css',
})
export class RollADiceComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  private casinoService: CasinoService = inject(CasinoService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private messageService: MessageService = inject(MessageService);
  private websocketService: WebSocketService = inject(WebSocketService);
  private websocketSubscription: Subscription | null = null;

  casinoBalance: number = 0;
  winAmount: number = 0;
  private pendingWin: number = 0;
  depositAmount: number = 0;

  dice1: number | null = null;
  dice2: number | null = null;
  timeLeft: number | null = null;
  isRolling: boolean = false;
  isLocked: boolean = false;
  clearMode: boolean = false;
  isModalOpen: boolean = false;

  // CENT FORMAT FOR THE SAKE OF THE INTEGER OVERFLOW AND DATABASE
  currentStake: number = 10;
  stakeOptions: number[] = [20, 50, 100, 200, 500, 1000, 2500, 5000, 10000]

  bets: Bets = {};

  ngOnInit(): void {
    this.getBalance();

    this.websocketService.disconnect();
    this.websocketService.connect();

    this.websocketSubscription = this.websocketService.message$.subscribe((message: any) => this.handleEvent(message))
  }

  ngOnDestroy(): void {
    this.bets = {};
    this.websocketSubscription?.unsubscribe();
    this.websocketService.disconnect();
  }

  handleEvent(message: any): void {

    if (!message || !message.type) {
      return;
    }

    let data: any = null;

    if (message.data) {
      try {
        data = typeof message.data === 'string' ? JSON.parse(message.data) : message.data;
      } catch (e) {}
    }

    switch (message.type) {

      case 'game_state':
        this.isLocked = data?.isLocked ?? false;
        this.timeLeft = data?.timeLeft ?? 15;
        this.dice1 = data?.dice1 ?? 1;
        this.dice2 = data?.dice2 ?? 1;
        break;

      case 'round_start':
        this.isLocked = false;
        this.pendingWin = 0;
        this.winAmount = 0;
        this.timeLeft = data?.timeLeft ?? 15;
        break;

      case 'round_timer':
        this.timeLeft = data?.timeLeft ?? 0;
        if (this.timeLeft === 1) {
          this.submitBets();
        }
        break;

      case 'round_lock':
        this.isLocked = true;
        break;

      case 'round_result':
        if (data) {
          this.isLocked = true;
          this.rollDiceAnimation(data.dice1, data.dice2);
        }
        break;

      case 'casino_balance_updated':
        this.casinoBalance = data?.balance;
        this.adjustCurrentStake();
        break;

      case 'casino_win':
        const win: number = Number(data?.win_amount ?? 0);
        if (win > 0) {
          this.pendingWin = win;
        }
        break;
    }

    this.cdr.detectChanges();
  }

  rollDiceAnimation(result1: number, result2: number): void {
    this.isRolling = true;

    let count: number = 0;

    setTimeout((): void => {
      const interval = setInterval(() => {

        this.dice1 = Math.floor(Math.random() * 6) + 1;
        this.dice2 = Math.floor(Math.random() * 6) + 1;
        this.cdr.detectChanges();

        count++;

        if (count > 10) {
          clearInterval(interval);
          this.dice1 = result1;
          this.dice2 = result2;

          this.isRolling = false;

          if (this.pendingWin > 0) {
            this.winAmount = this.pendingWin;
            this.pendingWin = 0;

            setTimeout((): void => {
              this.winAmount = 0;
              this.cdr.detectChanges();
            }, 2000)
          }

          this.cdr.detectChanges();
        }

      }, 80);
    }, 10);
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

  placeBet(key: string): void {
    if (this.isLocked) {
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

  getBalance(): void {
    this.casinoService.getBalance().subscribe({
      next: (response: CasinoBalance): void => {
        this.casinoBalance = response.balance;
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Couldn't load Casino Balance" });
        // error log service
      }
    });
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

        window.dispatchEvent(new Event('websocket-refresh'));
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Couldn't deposit Casino Balance" });
      }
    });
  }
}
