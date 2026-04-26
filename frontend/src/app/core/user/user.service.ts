import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';

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
  private auth = inject(AuthService);

  private balanceUrl = 'http://localhost:8080/api/users/balance';
  private userUrl = 'http://localhost:8080/api/users';

  getUser() {
    const userId = this.auth.getUserIdFromToken();
    if (!userId) {
      throw new Error('User not logged in.');
    }

    return this.http.get<User>(`${this.userUrl}/${userId}`);
  }

  getBalance(): Observable<Balance> {
    const userId = this.auth.getUserIdFromToken();
    if (!userId) {
      throw new Error("User not logged in");
    }

    return this.http.get<Balance>(`${this.balanceUrl}/${userId}`);
  }
}
