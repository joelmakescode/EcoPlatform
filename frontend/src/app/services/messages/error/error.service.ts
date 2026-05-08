import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {FALLBACK_ERROR_MESSAGE, ERROR_MESSAGES} from './error-messages';
import {ErrorCode} from './error-codes';

export interface ApplicationError {
  message: string;
  status?: number;
}

@Injectable({
  providedIn: 'root',
})

export class ErrorService {
  private errorSubject = new Subject<ApplicationError>();
  error$ = this.errorSubject.asObservable();

  showApiError(errorCode?: string, status?: number) {
    let message = FALLBACK_ERROR_MESSAGE;

    if (errorCode && errorCode in ERROR_MESSAGES) {
      message = ERROR_MESSAGES[errorCode as ErrorCode];
    }

    this.errorSubject.next({
      message: message,
      status: status,
    })
  }

}
