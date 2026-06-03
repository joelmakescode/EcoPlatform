import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {UserService} from './user.service';
import {UserHeaderInfo} from '../../client/models/user/user.model';


@Injectable({ providedIn: 'root' })
export class UserStatesService {
  private userService: UserService = inject(UserService);
  private userHeaderInfoSubject: BehaviorSubject<UserHeaderInfo> = new BehaviorSubject<UserHeaderInfo>({ username: '', balance: 0 });
  public userHeaderInfo$: Observable<UserHeaderInfo> = this.userHeaderInfoSubject.asObservable();

  loadHeaderInfo(): void {
    forkJoin({ user: this.userService.getUser(), balance: this.userService.getBalance() }).subscribe(({ user, balance }): void => {
      this.userHeaderInfoSubject.next({ username: user.username, balance: balance.balance / 100 });
    });
  }
}
