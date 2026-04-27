import {inject, Injectable} from '@angular/core';
import {UserIdentityState} from './states/user-identity.state';
import {UserBalanceState} from './states/user-balance.state';

@Injectable({ providedIn: 'root' })
export class StatesService {
  private userIdentityState = inject(UserIdentityState);
  private userBalanceState = inject(UserBalanceState);

  loadRefreshStates(): void {
    this.userBalanceState.load();
    this.userIdentityState.loadIdentity();
  }
}
