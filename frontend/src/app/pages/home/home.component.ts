import { Component } from '@angular/core';
import {HeaderComponent} from '../../component/header/header.component';
import {SidebarComponent} from '../../component/sidebar/sidebar.component';
import {TileComponent} from '../../component/shared/tile/tile.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    TileComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
