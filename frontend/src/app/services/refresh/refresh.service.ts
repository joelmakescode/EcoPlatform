import {inject, Injectable} from '@angular/core';
import {AuthFacadeService} from '../auth-facade/auth-facade.service';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  private authFacadeService: AuthFacadeService = inject(AuthFacadeService);

  init(): void {
    if (!this.authFacadeService.isLoggedIn()) {
      this.authFacadeService.logout();
    }
  }
}
