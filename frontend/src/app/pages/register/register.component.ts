import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {MessageService} from '../../services/messages/message.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})

export class RegisterComponent {
  private authService: AuthService = inject(AuthService);
  private messageService: MessageService = inject(MessageService);

  email: string = "";
  username: string = "";
  password: string = "";
  repeatPassword: string = "";

  loading: boolean = false;


  onSubmit(form: any): void {
    if (form.invalid) {
      return;
    }

    this.loading = true;

    this.authService.register(this.email, this.username, this.password).subscribe({
      next: (): void => {
        this.messageService.success({ message: "Successfully registered" });
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Registration failed" });
      }
    });

    this.loading = false;
  }
}
