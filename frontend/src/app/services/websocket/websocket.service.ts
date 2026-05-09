import { Injectable, inject } from '@angular/core';
import { AuthTokenService } from '../auth-token/auth-token.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private authTokenService: AuthTokenService = inject(AuthTokenService);

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
        const message = JSON.parse(event.data);

        if (message.type === 'refresh') {
          window.dispatchEvent(new CustomEvent('websocket-refresh', {
            detail: message
          }));
        }
      } catch (error) {

      }
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

