import {Injectable, inject, NgZone} from '@angular/core';
import { AuthTokenService } from '../auth-token/auth-token.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private authTokenService: AuthTokenService = inject(AuthTokenService);
  private ngZone: NgZone = inject(NgZone);

  private messageSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public message$: Observable<any> = this.messageSubject.asObservable();

  private refreshSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public refresh$: Observable<any> = this.refreshSubject.asObservable();

  connect(): void {

    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    const token: string | null = this.authTokenService.getToken();
    if (!token) {
      return;
    }

    const wsUrl = `ws://localhost:8080/ws?token=${token}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onmessage = (event: MessageEvent<any>): void => {
      try {
        const message: any = JSON.parse(event.data);
        this.messageSubject.next(message);

        if (message.type === 'refresh') {
          this.refreshSubject.next(message);
        }
      } catch (error) {}
    };

    this.socket.onclose = (): void => {
      setTimeout((): void => this.connect(), 3000);
    };

    // LEAVE LIKE THIS AT FIRST
    this.socket.onerror = (error: Event): void => {
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

