import {inject, Injectable} from '@angular/core';
import {AuthTokenService} from '../auth-token/auth-token.service';
import {Router} from '@angular/router';
import {SuccessService} from '../messages/success/success.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserContextService} from '../user/usercontext.service';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private authTokenService: AuthTokenService = inject(AuthTokenService);
  private successService: SuccessService = inject(SuccessService);
  private router: Router = inject(Router);
  private userContextService: UserContextService = inject(UserContextService);

  private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  isLoggedIn(): boolean {
    this.loggedIn$.next(true);
    return this.authTokenService.isValid();
  }

  logout(): void {
    this.router.navigate(['/login']);
    this.successService.showApiSuccess("LOGOUT_SUCCESSFUL");
    this.authTokenService.clear();
    this.userContextService.clearUsername();
  }
}
