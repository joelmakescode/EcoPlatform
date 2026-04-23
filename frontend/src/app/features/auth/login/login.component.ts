import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../core/auth/auth.service';
import {ErrorService} from '../../../core/error/error.service';
import {RouterLink} from '@angular/router';
import {AuthLayoutComponent} from '../../../shared/layouts/auth-layout/auth-layout.component';
import {SuccessService} from '../../../core/success/success.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  success: string = '';
  loading: boolean = false;

  constructor(private auth: AuthService, private errorService: ErrorService, private successService: SuccessService) {}

  onSubmit(form: any): void {
    if (form.invalid) {
      return;
    }

    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.successService.showApiSuccess("LOGIN_SUCCESSFUL");
      },
      error: (err) => {
        this.loading = false;
        this.errorService.showApiError(err.error?.message, err.status);
      }
    })
  }
}
