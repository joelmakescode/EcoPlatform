import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserContextService} from './usercontext.service';
import {environment} from '../../../environment/environment';
import {Balance, DailyClaimStatus, User} from '../../client/models/user/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http: HttpClient = inject(HttpClient);
  private userCtx: UserContextService = inject(UserContextService);

  private readonly baseUrl: string = environment.apiBaseUrl;

  getDailyClaim(): Observable<DailyClaimStatus> {
    return this.http.get<DailyClaimStatus>(`${this.baseUrl}/users/daily-claim/${this.userCtx.UserId}`);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${this.userCtx.UserId}`);
  }

  getBalance(): Observable<Balance> {
    return this.http.get<Balance>(`${this.baseUrl}/users/balance/${this.userCtx.UserId}`);
  }

  postDailyClaim(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/daily-claim/${this.userCtx.UserId}`, {});
  }
}
