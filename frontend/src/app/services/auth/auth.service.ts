import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {environment} from '../../../environment/environment';
import {AuthTokenService} from '../auth-token/auth-token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authTokenService = inject(AuthTokenService);
  private http = inject(HttpClient)
  private readonly baseUrl = environment.apiBaseUrl;

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(this.baseUrl + "/login", {
      email,
      password,
      }).pipe(tap(response => {
        this.authTokenService.setToken(response.token);
      }
    ));
  }

  register(email: string, username:string, password: string) {
    return this.http.post<{ token: string }>(this.baseUrl + "/users", {
      email,
      username,
      password,
    });
  }
}
