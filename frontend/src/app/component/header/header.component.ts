import {ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthFacadeService} from '../../services/auth-facade/auth-facade.service';
import {Balance, User, UserService} from '../../services/user/user.service';
import {WebSocketService} from '../../services/websocket/websocket.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authFacadeService: AuthFacadeService = inject(AuthFacadeService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private userService: UserService = inject(UserService);
  private webSocketService: WebSocketService = inject(WebSocketService);

  username: string = '';
  balance: number = 0;

  ngOnInit() {
    this.authFacadeService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadUser();
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
