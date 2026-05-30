import {ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthFacadeService} from '../../services/auth-facade/auth-facade.service';
import {UserService} from '../../services/user/user.service';
import {WebSocketService} from '../../services/websocket/websocket.service';
import {NgIf} from '@angular/common';
import {Balance, DailyClaimStatus, User} from '../../client/models/user/user.model';
import {Subscription} from 'rxjs';
import {MessageService} from '../../services/messages/message.service';

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
  private messageService: MessageService = inject(MessageService);
  private userService: UserService = inject(UserService);
  private webSocketService: WebSocketService = inject(WebSocketService);

  private websocketSubscription!: Subscription;

  username: string = '';
  balance: number = 0;
  dailyClaim: boolean = false;

  ngOnInit(): void {
    this.authFacadeService.isLoggedIn$.subscribe((isLoggedIn: boolean): void => {
      if (isLoggedIn) {
        this.loadUser();
        this.loadDailyClaim();
        this.cdr.detectChanges();
      }
    });

    this.webSocketService.connect();
    this.websocketSubscription = this.webSocketService.refresh$.subscribe((): void => {
      this.loadUser();
      this.cdr.detectChanges();
    })
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
    this.websocketSubscription.unsubscribe();
  }

  loadUser(): void {
    this.userService.getUser().subscribe((response: User): void => {
      this.username = response.username;
    })

    this.userService.getBalance().subscribe((response: Balance): void => {
      this.balance = response.balance / 100;
    })
  }

  loadDailyClaim(): void {
    this.userService.getDailyClaim().subscribe({
      next: (response: DailyClaimStatus): void => {
        this.dailyClaim = response.can_claim;
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Can't load Daily Claim" });
        // error log service
      }
    })
  }

  claimDaily(): void {
    this.userService.postDailyClaim().subscribe({
      next: (): void => {
        this.dailyClaim = false;
        this.messageService.success({ message: "Daily Claim successfully claimed" });
        this.cdr.detectChanges();
      },
      error: (err: any): void => {
        this.messageService.error({ message: "Claiming Daily Claim failed" });
        // error log service
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

  logout(): void {
    this.authFacadeService.logout();
  }
}
