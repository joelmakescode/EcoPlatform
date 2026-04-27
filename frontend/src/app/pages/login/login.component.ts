import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {ErrorService} from '../../services/messages/error/error.service';
import {Router, RouterLink} from '@angular/router';
import {AuthLayoutComponent} from '../../component/shared/layouts/auth-layout/auth-layout.component';
import {SuccessService} from '../../services/messages/success/success.service';
import {UserService} from '../../services/user/user.service';
import {StatesService} from '../../client/states.service';


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
  private statesService = inject(StatesService);
  private successService = inject(SuccessService);
  private router = inject(Router);

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
        this.statesService.loadRefreshStates();

        this.router.navigate(['/home']).then();
      },
      error: (err) => {
        this.loading = false;
        this.errorService.showApiError(err.error?.message, err.status);
      }
    })
  }
}
