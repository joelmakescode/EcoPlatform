import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {BackLinkComponent} from '../../shared/back-link/back-link.component';

@Component({
  selector: 'app-content-box',
  standalone: true,
  imports: [
  ],
  templateUrl: './content-box.component.html',
  styleUrl: './content-box.component.css',
})
export class ContentBoxComponent {
  @Input() title!: string;
}
