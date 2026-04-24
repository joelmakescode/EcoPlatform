import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../core/auth/auth.service';
import {ErrorService} from '../../../core/error/error.service';
import {Router, RouterLink} from '@angular/router';
import {AuthLayoutComponent} from '../../../shared/layouts/auth-layout/auth-layout.component';
import {SuccessService} from '../../../core/success/success.service';
import {UserIdentityState} from '../../../core/user/user-identity.state';
import {UserBalanceState} from '../../../core/user/user-balance.state';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  private auth = inject(AuthService);
  private errorService = inject(ErrorService);
  private successService = inject(SuccessService);
  private router = inject(Router);

  private balanceState = inject(UserBalanceState);
  private identityState = inject(UserIdentityState);

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

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.successService.showApiSuccess("LOGIN_SUCCESSFUL");

        this.identityState.setIdentity({ email: this.email, username: "Joel" });
        this.balanceState.setBalance(1000);

        this.router.navigate(['/home']).then();
      },
      error: (err) => {
        this.loading = false;
        this.errorService.showApiError(err.error?.message, err.status);
      }
    })
  }
}
