import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {RollADiceState} from '../../../../../types/casino/casino.interface';


@Injectable({ providedIn: 'root' })
export class RollADiceStateService {
  private state: BehaviorSubject<RollADiceState> = new BehaviorSubject<RollADiceState>({
    dice1: null,
    dice2: null,
    timeLeft: null,
    isLocked: false,
    isRolling: false,
    winAmount: 0,
  });

  state$: Observable<RollADiceState> = this.state.asObservable();

  setState(patch: Partial<RollADiceState>): void {
    this.state.next({
      ...this.state.value,
      ...patch,
    })
  }

  get State(): RollADiceState {
    return this.state.value;
  }
}
