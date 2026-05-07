import {inject, Injectable} from '@angular/core';
import {AuthTokenService} from '../auth-token/auth-token.service';
import {Router} from '@angular/router';
import {SuccessService} from '../messages/success/success.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private AuthTokenService = inject(AuthTokenService);
  private successService = inject(SuccessService);
  private router = inject(Router);

  private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  isLoggedIn(): boolean {
    this.loggedIn$.next(true);
    return this.AuthTokenService.isValid();
  }

  logout(): void {
    this.router.navigate(['/login']);
    this.successService.showApiSuccess("LOGOUT_SUCCESSFUL");
    this.AuthTokenService.clear();
  }
}
