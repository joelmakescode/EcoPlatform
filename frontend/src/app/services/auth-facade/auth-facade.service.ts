import {inject, Injectable} from '@angular/core';
import {AuthTokenService} from '../auth-token/auth-token.service';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserContextService} from '../user/usercontext.service';
import {MessageService} from '../messages/message.service';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private authTokenService: AuthTokenService = inject(AuthTokenService);
  private messageService: MessageService = inject(MessageService);
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
    this.router.navigate(['/login']).then();
    this.messageService.success({ message: "Logged Out" });
    this.authTokenService.clear();
    this.userContextService.clearUsername();
  }
}
