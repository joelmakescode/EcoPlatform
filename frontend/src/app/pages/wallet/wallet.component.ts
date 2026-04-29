import { Component } from '@angular/core';
import {TileComponent} from '../../component/shared/tile/tile.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    TileComponent
  ],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
})
export class WalletComponent {}
