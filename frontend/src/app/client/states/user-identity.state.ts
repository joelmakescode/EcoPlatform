import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserService} from '../../services/user/user.service';

export interface UserIdentity {
  email: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class UserIdentityState {
  private userService = inject(UserService);

  private identitySubject = new BehaviorSubject<UserIdentity | null>(null);
  user$ = this.identitySubject.asObservable();

  loadIdentity() {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.identitySubject.next({
          email: user.email,
          username: user.username
        });

        localStorage.setItem('identity', JSON.stringify(user.username));
      },
      error: (error) => {
        console.error(error);
        this.identitySubject.next(null);
      }
    })
  }

  clear() {
    this.identitySubject.next(null);
    localStorage.removeItem('identity');
  }
}
