import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ErrorToastComponent} from './shared/error-toast/error-toast.component';
import {SuccessToastComponent} from './shared/success-toast/success-toast.component';
import {HeaderComponent} from './shared/layouts/header/header.component';
import {AppInitService} from './appinit.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorToastComponent, SuccessToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(init: AppInitService) {
    init.init();
  }
}
