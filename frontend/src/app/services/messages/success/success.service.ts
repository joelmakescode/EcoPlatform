import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FALLBACK_SUCCESS_MESSAGE, SUCCESS_MESSAGES} from './success-messages';
import {ApplicationSuccess} from '../../../client/models/messages/message.model';

@Injectable({
  providedIn: 'root',
})

export class SuccessService {
  private successObject: Subject<ApplicationSuccess> = new Subject<ApplicationSuccess>();
  success$: Observable<ApplicationSuccess> = this.successObject.asObservable();

  showApiSuccess(successCode?: string, additionalInfo?: string): void {
    let message: string = FALLBACK_SUCCESS_MESSAGE;

    if (successCode && successCode in SUCCESS_MESSAGES) {
      message = SUCCESS_MESSAGES[successCode];
    }

    this.successObject.next({
      message: message,
      additionalInfo: additionalInfo
    })
  }
}
