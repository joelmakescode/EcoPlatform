import {inject, Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthFacadeService} from '../auth-facade/auth-facade.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  private authFacadeService: AuthFacadeService = inject(AuthFacadeService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.authFacadeService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
