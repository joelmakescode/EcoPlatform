import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserContextService} from '../user/usercontext.service';
import {environment} from '../../../../environment/environment';
import {Observable} from 'rxjs';
import {Bets, CasinoBalance} from '../../../types/casino/casino.interface';


@Injectable({providedIn: 'root'})
export class CasinoService {
  private http: HttpClient = inject(HttpClient);
  private userCtx: UserContextService = inject(UserContextService);

  private readonly baseUrl: string = environment.apiBaseUrl;

  getBalance(): Observable<CasinoBalance> {
    return this.http.get<CasinoBalance>(`${this.baseUrl}/casino/balance/${this.userCtx.UserId}`);
  }

  postCashoutBalance(amount: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/casino/balance/cashout/${this.userCtx.UserId}`, { balance: Math.round(amount * 100)});
  }

  postDepositBalance(amount: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/casino/balance/deposit/${this.userCtx.UserId}`, { balance: Math.round(amount * 100) });
  }

  postBets(bets: Bets): Observable<void> {
    console.log(bets);
    return this.http.post<void>(`${this.baseUrl}/casino/roll-a-dice/${this.userCtx.UserId}`, { bets });
  }
}
