import {ChangeDetectorRef, Component, HostListener, inject, OnInit} from '@angular/core';
import {UserBalanceState} from '../../client/states/user-balance.state';
import {UserIdentityState} from '../../client/states/user-identity.state';
import {combineLatest, interval} from 'rxjs';
import {AsyncPipe, DecimalPipe, NgIf} from '@angular/common';
import {AuthFacadeService} from '../../services/auth-facade/auth-facade.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private balanceState = inject(UserBalanceState);
  private userState = inject(UserIdentityState);

  private authFacadeService = inject(AuthFacadeService);
  private cdr = inject(ChangeDetectorRef);

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

  logout() {
    this.authFacadeService.logout();
  }
}
