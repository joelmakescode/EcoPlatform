import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserContextService} from './usercontext.service';
import {environment} from '../../../environment/environment';

export interface Balance {
  balance: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private userCtx = inject(UserContextService);
  private readonly baseUrl = environment.apiBaseUrl;

  getUser() {
    return this.http.get<User>(`${this.baseUrl}/users/${this.userCtx.UserId}`);
  }

  getIdByUsername(username: string) {
    return this.http.get<{ id: number }>(`${this.baseUrl}/users?username=${username}`);
  }

  getBalance(): Observable<Balance> {
    return this.http.get<Balance>(`${this.baseUrl}/users/balance/${this.userCtx.UserId}`);
  }
}
