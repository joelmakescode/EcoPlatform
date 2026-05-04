import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable, switchMap} from 'rxjs';
import {environment} from '../../../environment/environment';
import {UserService} from '../user/user.service';
import {
  Transaction,
  TransactionResponse,
} from '../../client/models/transactions/transaction.model';
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
          amount: amount * 100,
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
          // must be taken * 100 since we calculate in cents, should be put into the backend probably
          amount: amount * 100,
          type: 'request'
        })
      })
    )
  }

  acceptTransaction(id: string) {
    return this.http.post<void>(`${this.baseUrl}/${id}/accept`, null);
  }

  cancelTransaction(id: string) {
    return this.http.post<void>(`${this.baseUrl}/${id}/cancel`, null);
  }

  refundTransaction(id: string) {
    return this.http.post<void>(`${this.baseUrl}/${id}/refund`, null);
  }

  rejectTransaction(id: string) {
    return this.http.post<void>(`${this.baseUrl}/${id}/reject`, null);
  }
}
