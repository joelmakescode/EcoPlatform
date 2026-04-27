import {inject, Injectable} from '@angular/core';
import {AuthTokenService} from '../auth-token/auth-token.service';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private authTokenService = inject(AuthTokenService);

  get UserId(): number {
    const userId = this.authTokenService.getUserId();
    if (!userId) {
      throw new Error('User not logged in.');
    }

    return userId;
  }
}
