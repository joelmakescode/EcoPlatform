import {Component, inject, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-casino-game-tile',
  imports: [],
  templateUrl: './casino-game-tile.component.html',
  styleUrl: './casino-game-tile.component.css',
})
export class CasinoGameTileComponent {
  private router: Router = inject(Router);

  @Input() title!: string;
  @Input() icon!: string;
  @Input() route!: string;
  @Input() type!: string;

  // Live Data
  // Roll a dice
  @Input() dice1?: number | null;
  @Input() dice2?: number | null;
  @Input() timer?: number | null;
  @Input() isLocked?: boolean;

  navigate(): void {
    this.router.navigate([this.route]);
  }
}
