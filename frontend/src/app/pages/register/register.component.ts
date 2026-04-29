import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {SuccessService} from '../../services/messages/success/success.service';
import {ErrorService} from '../../services/messages/error/error.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})

export class RegisterComponent {
  email: string = "";
  username: string = "";
  password: string = "";
  repeatPassword: string = "";

  error: string = "";
  success: string = "";

  loading: boolean = false;

  constructor(private auth: AuthService, private successService: SuccessService, private errorService: ErrorService) {
  }

  onSubmit(form: any): void {
    if (form.invalid) {
      return;
    }

    this.loading = true;

    this.auth.register(this.email, this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.successService.showApiSuccess("SUCCESSFUL_REGISTERED");
      },
      error: (err) => {
        this.loading = false;
        this.errorService.showApiError(err.error?.message, err.status);
      }
    });
  }
}
