import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)

  private loginApiUrl: string = "http://localhost:8080/api/login";
  private registerApiUrl: string = "http://localhost:8080/api/users";

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(this.loginApiUrl, {
      email,
      password,
      }).pipe(tap(response => {
        localStorage.setItem('jwt_token', response.token);
      }
    ));
  }

  register(email: string, username:string, password: string) {
    return this.http.post<{ token: string }>(this.registerApiUrl, {
      email,
      username,
      password,
    });
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getUserIdFromToken(): number | null {
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
