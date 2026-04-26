import {inject, Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private auth = inject(AuthService);

  get UserId(): number {
    const userId = this.auth.getUserIdFromToken()
    if (!userId) {
      throw new Error('User not logged in.');
    }

    return userId;
  }
}
