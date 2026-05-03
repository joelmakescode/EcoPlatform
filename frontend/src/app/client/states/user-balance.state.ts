import { inject, Injectable, DestroyRef } from '@angular/core';
import { BehaviorSubject, interval, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user/user.service';

@Injectable({ providedIn: 'root' })
export class UserBalanceState {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  private balanceSubject = new BehaviorSubject<number | null>(null);
  balance$ = this.balanceSubject.asObservable();

  constructor() {
    interval(2000)
      .pipe(
        startWith(0),
        switchMap(() => this.userService.getBalance()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(response => {
        const balance = response.balance / 100;

        this.balanceSubject.next(balance);
        localStorage.setItem('balance', JSON.stringify(balance));
      });
  }

  clear(): void {
    this.balanceSubject.next(null);
    localStorage.removeItem('balance');
  }
}
