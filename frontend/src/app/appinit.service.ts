import {inject, Injectable} from '@angular/core';
import {AuthService} from './core/auth/auth.service';
import {UserIdentityState} from './core/user/user-identity.state';
import {UserBalanceState} from './core/user/user-balance.state';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  private auth = inject(AuthService);
  private identity = inject(UserIdentityState);
  private balance = inject(UserBalanceState);

  init(): void {
    if (this.auth.isLoggedIn()) {
      this.identity.loadIdentity();
      this.balance.load();
    }
  }
}
