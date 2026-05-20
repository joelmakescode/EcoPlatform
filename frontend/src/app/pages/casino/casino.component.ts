import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-casino',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './casino.component.html',
  styleUrl: './casino.component.css',
})
export class CasinoComponent {}
