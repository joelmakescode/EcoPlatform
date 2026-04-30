import {inject, Injectable} from '@angular/core';
import {UserIdentityState} from './user-identity.state';
import {UserBalanceState} from './user-balance.state';

@Injectable({ providedIn: 'root' })
export class StatesService {
  private userIdentityState = inject(UserIdentityState);
  private userBalanceState = inject(UserBalanceState);

  loadRefreshStates(): void {
    this.userBalanceState.load();
    this.userIdentityState.loadIdentity();
  }
}
