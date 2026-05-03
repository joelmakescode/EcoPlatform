import {inject, Injectable} from '@angular/core';
import {UserIdentityState} from './user-identity.state';

@Injectable({ providedIn: 'root' })
export class StatesService {
  private userIdentityState = inject(UserIdentityState);

  loadRefreshStates(): void {
    this.userIdentityState.loadIdentity();
  }
}
