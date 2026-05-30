import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ApplicationError, ApplicationSuccess} from '../../client/models/messages/message.model';


@Injectable({ providedIn: 'root' })
export class MessageService {
  private errorSubject: Subject<ApplicationError> = new Subject<ApplicationError>();
  private successObject: Subject<ApplicationSuccess> = new Subject<ApplicationSuccess>();

  error$: Observable<ApplicationError> = this.errorSubject.asObservable();
  success$: Observable<ApplicationSuccess> = this.successObject.asObservable();

  error(errorMessage: ApplicationError): void {
    this.errorSubject.next(errorMessage);
  }

  success(successMessage: ApplicationSuccess): void {
    this.successObject.next(successMessage);
  }
}
