import {inject, Injectable} from '@angular/core';
import {AuthTokenService} from '../auth-token/auth-token.service';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private AuthTokenService = inject(AuthTokenService);
  private router = inject(Router);

  isLoggedIn(): boolean {
    return this.AuthTokenService.isValid();
  }

  logout(): void {
    this.router.navigate(['/login']);
    this.AuthTokenService.clear();
  }
}
