import {inject, Injectable} from '@angular/core';
import {WebSocketService} from '../../../websocket/websocket.service';
import {RollADiceStateService} from './rolladicestate.service';
import {Observable, share, Subject, Subscription} from 'rxjs';
import {CasinoStateService} from '../../casinostate.service';


@Injectable({ providedIn: 'root' })
export class RollADiceLiveService {
  private casinoStateService: CasinoStateService = inject(CasinoStateService);
  private stateService: RollADiceStateService = inject(RollADiceStateService);
  private websocketService: WebSocketService = inject(WebSocketService);

  private roundLock$: Subject<void> = new Subject<void>();
  public roundLockObservable$: Observable<void> = this.roundLock$.asObservable();

  private pendingWin: number = 0;

  constructor() {
    this.websocketService.message$.subscribe((message: any): void => {
      this.handleEvent(message);
    })
  }

  private handleEvent(message: any): void {
    if (!message) { return; }
    const type: any = message.type || message.event;
    let data: any = null;

    try {
      if (message.data) {
        data = typeof message.data === 'string' ? JSON.parse(message.data) : message.data;
      }
    } catch {
      data = null;
    }

    switch (type) {
      case 'game_state':
        this.stateService.setState({
          dice1: data?.dice1,
          dice2: data?.dice2,
          timeLeft: data?.timeLeft ?? 15,
          isLocked: data?.isLocked ?? false,
        });
        break;

      case 'round_timer':
        this.stateService.setState({
          dice1: data?.dice1,
          dice2: data?.dice2,
          timeLeft: data?.timeLeft,
          isLocked: data?.isLocked ?? false,
        });

        break;

      case 'round_lock':
        this.stateService.setState({ isLocked: true });
        this.startRollingAnimation();
        this.roundLock$.next();
        break;

      case 'round_result':
        this.stopRollingAnimation(data?.dice1, data?.dice2);
        break;

      case 'casino_win':
        const win: number = Number(data?.win_amount ?? 0);
        if (win > 0) {
          this.pendingWin += win;

          this.stateService.setState({ winAmount: this.pendingWin });

          setTimeout((): void => {
            this.casinoStateService.load();
          }, 500);

          setTimeout(() => {
            this.pendingWin = 0;
            this.stateService.setState({ winAmount: this.pendingWin });
          }, 2000)
        }
        break;
    }
  }

  private rollingInterval: any;
  private startRollingAnimation(): void {
    this.stateService.setState({ isRolling: true });

    this.rollingInterval = setInterval((): void => {
      this.stateService.setState({
        dice1: Math.floor(Math.random() * 6) + 1,
        dice2: Math.floor(Math.random() * 6) + 1,
      });
    }, 80);
  }

  private stopRollingAnimation(result1: number, result2: number): void {
    if (this.rollingInterval) {
      clearInterval(this.rollingInterval);
    }

    this.stateService.setState({
      isRolling: false ,
      dice1: result1,
      dice2: result2,
    });
  }
}
