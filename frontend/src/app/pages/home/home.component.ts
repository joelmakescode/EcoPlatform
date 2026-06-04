import { Component } from '@angular/core';
import {TileComponent} from '../../shared/tile/tile.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TileComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
