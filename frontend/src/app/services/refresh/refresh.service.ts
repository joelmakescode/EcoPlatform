import {inject, Injectable} from '@angular/core';
import {AuthFacadeService} from '../auth-facade/auth-facade.service';
import {UserService} from '../user/user.service';
import {UserContextService} from '../user/usercontext.service';
import {User} from '../../client/models/user/user.model';
import {MessageService} from '../messages/message.service';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  private authFacadeService: AuthFacadeService = inject(AuthFacadeService);
  private messageService: MessageService = inject(MessageService);
  private userContextService: UserContextService = inject(UserContextService);
  private userService: UserService = inject(UserService);

  init(): void {
    if (!this.authFacadeService.isLoggedIn()) {
      this.authFacadeService.logout();
    }

    this.userService.getUser().subscribe({
      next: (response: User): void => {
        this.userContextService.setUsername(response.username);
      },
      error: (error: Error): void => {
        this.messageService.error({ message: "Your username couldn't be loaded. Please refresh the page or re-login again." });
        // error log service
      }
    })
  }
}
