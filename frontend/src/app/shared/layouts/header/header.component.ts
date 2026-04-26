import {Component, HostListener, inject} from '@angular/core';
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

  isDropDownOpen: boolean = false;

  toggleDropDown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  closeDropDown(): void {
    this.isDropDownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (target.closest('.user-menu')) {
      return;
    }

    this.closeDropDown();
  }
}
