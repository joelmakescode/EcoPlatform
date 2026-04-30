import { Component } from '@angular/core';
import {TileComponent} from '../../../component/shared/tile/tile.component';

@Component({
  selector: 'app-wallet-overview',
  imports: [
    TileComponent
  ],
  templateUrl: './wallet-overview.component.html',
  styleUrl: './wallet-overview.component.css',
})
export class WalletOverviewComponent {}
