import {Component, inject} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {ErrorToastComponent} from './component/shared/toasts/error-toast/error-toast.component';
import {SuccessToastComponent} from './component/shared/toasts/success-toast/success-toast.component';
import {RefreshService} from './services/refresh/refresh.service';
import {ToastService} from './component/shared/toasts/toastservice/toast.service';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorToastComponent, SuccessToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(refresh: RefreshService, router: Router, toastService: ToastService) {
    refresh.init();

    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      if (event.urlAfterRedirects.startsWith('/login') || event.urlAfterRedirects.startsWith('/register')) {
        toastService.setTopPosition(20);
      } else {
        toastService.setTopPosition(80);
      }
    })
  }
}
