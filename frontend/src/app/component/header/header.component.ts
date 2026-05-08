import {ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthFacadeService} from '../../services/auth-facade/auth-facade.service';
import {Balance, User, UserService} from '../../services/user/user.service';
import {WebSocketService} from '../../services/websocket/websocket.service';
import {NgIf} from '@angular/common';
import {ErrorService} from '../../services/messages/error/error.service';
import {SuccessService} from '../../services/messages/success/success.service';
import {DailyClaimStatus} from '../../client/models/header/dailyClaim.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authFacadeService: AuthFacadeService = inject(AuthFacadeService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private errorService: ErrorService = inject(ErrorService);
  private successService: SuccessService = inject(SuccessService);
  private userService: UserService = inject(UserService);
  private webSocketService: WebSocketService = inject(WebSocketService);

  username: string = '';
  balance: number = 0;
  dailyClaim: boolean = false;

  ngOnInit() {
    this.authFacadeService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadUser();
        this.loadDailyClaim();
      }
    });

    this.webSocketService.connect();
    window.addEventListener('websocket-refresh', this.handleWebSocketRefresh.bind(this));
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
    window.removeEventListener('websocket-refresh', this.handleWebSocketRefresh.bind(this));
  }

  loadUser() {
    this.userService.getUser().subscribe((response: User) => {
      this.username = response.username;
      this.cdr.detectChanges();
    })

    this.userService.getBalance().subscribe((response: Balance) => {
      this.balance = response.balance / 100;
      this.cdr.detectChanges();
    })
  }

  loadDailyClaim() {
    this.userService.getDailyClaim().subscribe({
      next: (response: DailyClaimStatus) => {
        console.log(response.can_claim);
        this.dailyClaim = response.can_claim;
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorService.showApiError(err.error?.message, err.status);
      }
    })
  }

  claimDaily() {
    this.userService.postDailyClaim().subscribe({
      next: () => {
        this.dailyClaim = false;
        this.successService.showApiSuccess("DAILY_CLAIM_SUCCESSFUL");
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorService.showApiError(err.error?.message, err.status);
      }
    })
  }

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

  private handleWebSocketRefresh(): void {
    this.loadUser();
  }
}
