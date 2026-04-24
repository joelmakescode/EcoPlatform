import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UserBalanceState {

  private balanceSubject = new BehaviorSubject<number | null>(null);
  balance$ = this.balanceSubject.asObservable();

  setBalance(balance: number) {
    this.balanceSubject.next(balance);
  }

  clear(): void {
    this.balanceSubject.next(null);
  }
}
