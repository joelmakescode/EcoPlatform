import {inject, Injectable} from '@angular/core';
import {AuthTokenService} from '../auth-token/auth-token.service';
import {Router} from '@angular/router';
import {UserService} from './user.service';
import {User} from '../../client/models/user/user.model';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private authTokenService: AuthTokenService = inject(AuthTokenService);

  private _username: string | null = null;

  get UserId(): number {
    const userId: number | null = this.authTokenService.getUserId();
    if (!userId) {
      throw new Error('User not logged in.');
    }

    return userId;
  }

  get Username(): string {
    if (!this._username) {
      throw new Error('Username required');
    }

    return this._username;
  }

  setUsername(username: string): void {
    this._username = username;
  }

  clearUsername(): void {
    this._username = null;
  }
}
