import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginApiUrl: string = "http://localhost:8080/api/login";
  private registerApiUrl: string = "http://localhost:8080/api/users";
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(this.loginApiUrl, {
      email,
      password,
    }).pipe(tap(response => this.token = response.token));
  }

  register(email: string, username:string, password: string) {
    return this.http.post<{ token: string }>(this.registerApiUrl, {
      email,
      username,
      password,
    });
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  logout() {
    this.token = null;
  }
}
