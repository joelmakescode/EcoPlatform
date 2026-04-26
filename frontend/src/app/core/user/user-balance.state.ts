import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserService} from './user.service';


@Injectable({ providedIn: 'root' })
export class UserBalanceState {
  private userService = inject(UserService);

  private balanceSubject = new BehaviorSubject<number | null>(null);
  balance$ = this.balanceSubject.asObservable();

  load() {
    this.userService.getBalance().subscribe(response => {
      this.balanceSubject.next(response.balance);
    })
  }

  clear(): void {
    this.balanceSubject.next(null);
  }
}
