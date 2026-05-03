import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable, switchMap} from 'rxjs';
import {TransactionResponse} from '../../client/models/transactions/transaction-response.model';
import {environment} from '../../../environment/environment';
import {UserService} from '../user/user.service';
import {Transaction} from '../../client/models/transactions/transaction.model';
import {AuthTokenService} from '../auth-token/auth-token.service';

@Injectable({ providedIn: "root" })
export class TransactionService {
  private readonly baseUrl: string = environment.apiBaseUrl + '/transactions';
  private http = inject(HttpClient);
  private authTokenService = inject(AuthTokenService);
  private userService = inject(UserService);

  getTransactions(userId: number | null, limit: number, cursor?: string | undefined): Observable<TransactionResponse> {
    let params = new HttpParams().set('limit', limit);

    if (cursor) {
      params = params.set('cursor', cursor);
    }

    return this.http.get<TransactionResponse>(
      `${this.baseUrl}/${userId}`,
      { params }
    );
  }

  sendMoneyTransaction(receiverUsername: string, amount: number ): Observable<Transaction> {
    return this.userService.getIdByUsername(receiverUsername).pipe(
      map(res => res.id),
      switchMap(receiverId => {
        return this.http.post<Transaction>(this.baseUrl, {
          sender_id: this.authTokenService.getUserId(),
          receiver_id: receiverId,
          amount: amount,
          type: 'send'
        })
      })
    );
  }

  requestMoneyTransaction(senderUsername: string, amount: number): Observable<Transaction> {
    return this.userService.getIdByUsername(senderUsername).pipe(
      map(res => res.id),
      switchMap(senderId => {
        return this.http.post<Transaction>(this.baseUrl, {
          sender_id: senderId,
          receiver_id: this.authTokenService.getUserId(),
          amount: amount,
          type: 'request'
        })
      })
    )
  }

  // TODO: refactor this to one method that gets called by both send and request money transactions
}
