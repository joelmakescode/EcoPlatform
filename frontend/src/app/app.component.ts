import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ErrorToastComponent} from './component/shared/error-toast/error-toast.component';
import {SuccessToastComponent} from './component/shared/success-toast/success-toast.component';
import {RefreshService} from './services/refresh/refresh.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorToastComponent, SuccessToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(refresh: RefreshService) {
    refresh.init();
  }
}
