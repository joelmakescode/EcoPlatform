import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {ErrorService} from '../../services/messages/error/error.service';
import {Router, RouterLink} from '@angular/router';
import {SuccessService} from '../../services/messages/success/success.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  private authService: AuthService = inject(AuthService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private errorService: ErrorService = inject(ErrorService);
  private successService: SuccessService = inject(SuccessService);
  private router: Router = inject(Router);

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
      next: () => {
        this.loading = false;
        this.successService.showApiSuccess("LOGIN_SUCCESSFUL");
        this.router.navigate(['/home']).then();
      },
      error: (err: any) => {
        this.loading = false;
        this.errorService.showApiError(err.error?.message, err.status);
      }
    })
  }
}
