import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)
  private platformId = inject(PLATFORM_ID);

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private readonly baseUrl = environment.apiBaseUrl;

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(this.baseUrl + "/login", {
      email,
      password,
      }).pipe(tap(response => {
        localStorage.setItem('jwt_token', response.token);
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

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return localStorage.getItem('jwt_token');
  }

  getUserIdFromToken(): number | null {
    if (!this.isBrowser()) {
      return null;
    }
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return null;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJSON = atob(payloadBase64);
      const payload = JSON.parse(payloadJSON);

      return payload.user_id;
    } catch (error) {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('jwt_token');
  }
}
