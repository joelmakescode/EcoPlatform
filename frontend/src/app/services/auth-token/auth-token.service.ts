import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  setToken(token: string): void {
    localStorage.setItem('jwt_token', token)
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  clear(): void {
    localStorage.removeItem('jwt_token');
  }

  getPayload(): any | null {
    const token: string | null = this.getToken();
    if (!token) { return null; }

    const parts: string[] = token.split('.');
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
    const payload: any = this.getPayload();

    if (!payload || typeof payload.exp !== 'number') {
      return false;
    }

    const now: number = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

}
