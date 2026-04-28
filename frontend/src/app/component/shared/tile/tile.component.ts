import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-tile',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css',
})
export class TileComponent {
 @Input() title!: string;
 @Input() icon?: string;
 @Input() route?: string;
}
