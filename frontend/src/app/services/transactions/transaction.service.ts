import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environment/environment';
import {
  Transaction,
  TransactionResponse,
} from '../../client/models/transactions/transaction.model';
import {UserContextService} from '../user/usercontext.service';

@Injectable({ providedIn: "root" })
export class TransactionService {
  private readonly baseUrl: string = environment.apiBaseUrl + '/transactions';
  private userContextService: UserContextService = inject(UserContextService);
  private http: HttpClient = inject(HttpClient);

  getTransactions(userId: number | null, limit: number, cursor?: string | undefined): Observable<TransactionResponse> {
    let params: HttpParams = new HttpParams().set('limit', limit);

    if (cursor) {
      params = params.set('cursor', cursor);
    }

    return this.http.get<TransactionResponse>(`${this.baseUrl}/${userId}`, { params });
  }

  sendMoneyTransaction(receiverUsername: string, amount: number ): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, {
      sender_username: this.userContextService.Username,
      receiver_username: receiverUsername,
      amount: amount * 100,
      type: 'send'
    })
  }

  requestMoneyTransaction(senderUsername: string, amount: number): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, {
      sender_username: senderUsername,
      receiver_username: this.userContextService.Username,
      // must be taken * 100 since we calculate in cents, should be put into the backend probably
      amount: amount * 100,
      type: 'request'
    })
  }

  acceptTransaction(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/accept`, null);
  }

  cancelTransaction(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/cancel`, null);
  }

  refundTransaction(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/refund`, null);
  }

  rejectTransaction(id: string): Observable<void>  {
    return this.http.post<void>(`${this.baseUrl}/${id}/reject`, null);
  }
}
