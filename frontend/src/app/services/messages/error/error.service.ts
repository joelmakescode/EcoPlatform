import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FALLBACK_ERROR_MESSAGE, ERROR_MESSAGES} from './error-messages';
import {ErrorCode} from './error-codes';
import {ApplicationError} from '../../../client/models/messages/message.model';

@Injectable({
  providedIn: 'root',
})

export class ErrorService {
  private errorSubject: Subject<ApplicationError> = new Subject<ApplicationError>();
  error$: Observable<ApplicationError> = this.errorSubject.asObservable();

  showApiError(errorCode?: string, status?: number): void {
    let message: string = FALLBACK_ERROR_MESSAGE;

    if (errorCode && errorCode in ERROR_MESSAGES) {
      message = ERROR_MESSAGES[errorCode as ErrorCode];
    }

    this.errorSubject.next({
      message: message,
      status: status,
    })
  }
}
