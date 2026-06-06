import {Injectable, inject} from '@angular/core';
import { AuthTokenService } from '../../../services/auth-token/auth-token.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {webSocket} from 'rxjs/internal/observable/dom/webSocket';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket$!: WebSocketSubject<any>
  private authTokenService: AuthTokenService = inject(AuthTokenService);

  private messageSubject: Subject<any> = new Subject<any>();
  public message$: Observable<any> = this.messageSubject.asObservable();

  private refreshSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public refresh$: Observable<any> = this.refreshSubject.asObservable();

  private pingInterval: any;

  constructor() {
    const token: string | null = this.authTokenService.getToken();
    if (token) {
      this.connect();
    }
  }

  connect(): void {
    const token: string | null = this.authTokenService.getToken();
    if (!token) { return; }

    if (this.socket$ && this.socket$.closed) {
      return;
    }

    this.socket$ = webSocket({ url: `ws://localhost:8080/ws?token=${token}`,
      openObserver: {
        next: (): void => {
          this.reconnectAttempts = 0;
          this.startHeartbeat();
        }
      },
      closeObserver: {
        next: (): void => {
          this.stopHeartbeat();
          this.reconnect();
        }
      }
    });

    this.socket$.subscribe({
      next: (message: any): void => {
        this.messageSubject.next(message);

        if (message.type === 'refresh') {
          this.refreshSubject.next(message);
        }
      },
      error: (): void => {
        this.socket$.complete();
      }
    })
  }

  disconnect(): void {
    this.stopHeartbeat();
    this.socket$.complete();
  }

  send(message: any): void {
    this.socket$.next(message);
  }

  private startHeartbeat(): void {
    this.pingInterval = setInterval((): void => {
      this.send({ type: 'ping' });
    }, 20000);
  }

  private stopHeartbeat(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
  }

  private reconnectAttempts: number = 0;
  private reconnect(): void {
    const delay: number = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    setTimeout((): void => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }
}

