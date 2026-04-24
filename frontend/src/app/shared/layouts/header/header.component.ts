import {Component, inject} from '@angular/core';
import {UserBalanceState} from '../../../core/user/user-balance.state';
import {UserIdentityState} from '../../../core/user/user-identity.state';
import {combineLatest} from 'rxjs';
import {AsyncPipe, DecimalPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    DecimalPipe,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private balanceState = inject(UserBalanceState);
  private userState = inject(UserIdentityState);

  vm$ = combineLatest({
    identity: this.userState.user$,
    balance: this.balanceState.balance$,
  })
}
