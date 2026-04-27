import {inject, Injectable} from '@angular/core';
import {AuthFacadeService} from '../auth-facade/auth-facade.service';
import {StatesService} from '../../client/states.service';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  private authFacadeService = inject(AuthFacadeService);
  private statesService = inject(StatesService);

  init(): void {
    if (this.authFacadeService.isLoggedIn()) {
      this.statesService.loadRefreshStates();
    } else {
      this.authFacadeService.logout();
    }
  }
}
