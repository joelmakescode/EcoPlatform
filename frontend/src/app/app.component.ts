import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ErrorToastComponent} from './shared/error-toast/error-toast.component';
import {SuccessToastComponent} from './shared/success-toast/success-toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorToastComponent, SuccessToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly title = signal('frontend');
}
