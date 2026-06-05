import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../client/services/auth/auth.service';
import {Router, RouterLink} from '@angular/router';
import {MessageService} from '../../client/services/message/message.service';
import {WebSocketService} from '../../client/services/websocket/websocket.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  private authService: AuthService = inject(AuthService);
  private messageService: MessageService = inject(MessageService);
  private router: Router = inject(Router);
  private websocketService: WebSocketService = inject(WebSocketService);

  email: string = '';
  password: string = '';
  error: string = '';
  success: string = '';
  loading: boolean = false;

  onSubmit(form: any): void {
    if (form.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (): void => {
        this.messageService.success({ message: "Login successful" });
        this.websocketService.connect();
        this.router.navigate(['/home']).then();
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Login failed" });
        // error log service
      }
    });

    this.loading = false;
  }
}
