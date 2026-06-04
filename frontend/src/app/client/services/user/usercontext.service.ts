import {inject, Injectable} from '@angular/core';
import {AuthTokenService} from '../../../services/auth-token/auth-token.service';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private authTokenService: AuthTokenService = inject(AuthTokenService);
  private _username: string | null = null;

  get UserId(): number {
    const userId: number | null = this.authTokenService.getUserId();
    if (!userId) {
      return 0;
    }

    return userId;
  }

  get Username(): string | null {
    if (!this._username) {
      return null;
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
