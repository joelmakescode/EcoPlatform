import { Component } from '@angular/core';
import {HeaderComponent} from '../../component/shared/layouts/header/header.component';
import {SidebarComponent} from '../../component/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
