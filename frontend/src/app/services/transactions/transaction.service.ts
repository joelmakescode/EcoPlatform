import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TransactionResponse} from '../../client/models/transactions/transaction-response.model';
import {environment} from '../../../environment/environment';

@Injectable({ providedIn: "root" })
export class TransactionService {
  private readonly baseUrl: string = environment.apiBaseUrl + '/transactions';
  private http = inject(HttpClient);

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
}
