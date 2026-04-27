import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  setToken(token: string) {
    localStorage.setItem('jwt_token', token)
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  clear() {
    localStorage.removeItem('jwt_token');
  }

  getPayload(): any | null {
    const token = this.getToken();
    if (!token) { return null; }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  getUserId(): number | null {
    return this.getPayload()?.user_id ?? null;
  }

  isValid(): boolean {
    const payload = this.getPayload();

    if (!payload || typeof payload.exp !== 'number') {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

}
