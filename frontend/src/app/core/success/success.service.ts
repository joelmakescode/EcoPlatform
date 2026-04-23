import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {FALLBACK_SUCCESS_MESSAGE, SUCCESS_MESSAGES} from './success-messages';

export interface ApplicationSuccess {
  message: string;
  additionalInfo?: string;
}

@Injectable({
  providedIn: 'root',
})

export class SuccessService {
  private successObject = new Subject<ApplicationSuccess>();
  success$ = this.successObject.asObservable();

  showApiSuccess(successCode?: string, additionalInfo?: string) {
    let message = FALLBACK_SUCCESS_MESSAGE;

    if (successCode && successCode in SUCCESS_MESSAGES) {
      message = SUCCESS_MESSAGES[successCode];
    }

    this.successObject.next({
      message: message,
      additionalInfo: additionalInfo
    })
  }
}
