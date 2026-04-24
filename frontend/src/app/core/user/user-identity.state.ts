import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


export interface UserIdentity {
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserIdentityState {

  private identitySubject = new BehaviorSubject<UserIdentity | null>(null);
  user$ = this.identitySubject.asObservable();

  setIdentity(identity: UserIdentity) {
    this.identitySubject.next(identity);
  }

  clear() {
    this.identitySubject.next(null);
  }
}
