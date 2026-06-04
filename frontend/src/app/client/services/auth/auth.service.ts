import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../../environment/environment';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';
import {UserService} from '../user/user.service';
import {UserContextService} from '../user/usercontext.service';
import {User} from '../../../types/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authTokenService: AuthTokenService = inject(AuthTokenService);
  private http: HttpClient = inject(HttpClient);
  private userContextService: UserContextService = inject(UserContextService);
  private userService: UserService = inject(UserService);

  private readonly baseUrl: string = environment.apiBaseUrl;

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.baseUrl + "/login", {
      email,
      password,
      }).pipe(tap((response: { token: string }): void => {
        this.authTokenService.setToken(response.token);

        const userId: number | null = this.authTokenService.getUserId();
        if (userId) {
          this.userService.getUser().subscribe((response: User): void => {
            this.userContextService.setUsername(response.username);
          });
        }
      }
    ));
  }

  register(email: string, username:string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.baseUrl + "/users", {
      email,
      username,
      password,
    });
  }
}
