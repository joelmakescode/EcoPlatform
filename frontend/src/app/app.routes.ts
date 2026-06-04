import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import {HomeComponent} from './pages/home/home.component';
import {WalletComponent} from './pages/wallet/wallet.component';
import {AppLayoutComponent} from './components/app/app-layout.component';
import {AuthLayoutComponent} from './components/auth/auth-layout.component';
import {TransactionsComponent} from './pages/wallet/transactions/transactions.component';
import {WalletOverviewComponent} from './pages/wallet/wallet-overview/wallet-overview.component';
import {SendMoneyComponent} from './pages/wallet/send-money/send-money.component';
import {RequestMoneyComponent} from './pages/wallet/request-money/request-money.component';
import {CasinoComponent} from './pages/casino/casino.component';
import {CasinoOverviewComponent} from './pages/casino/casino-overview/casino-overview.component';
import {RollADiceComponent} from './pages/casino/roll-a-dice/roll-a-dice.component';
import {SlotMachinesComponent} from './pages/casino/slot-machines/slot-machines.component';
import {FootballBetsComponent} from './pages/casino/football-bets/football-bets.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'casino', component: CasinoComponent, children: [
          { path: '', component:  CasinoOverviewComponent },
          { path: 'roll-a-dice', component: RollADiceComponent },
          { path: 'slot-machines', component: SlotMachinesComponent },
          { path: 'football-bets', component: FootballBetsComponent },
        ]
      },
      { path: 'wallet', component: WalletComponent, children: [
          { path: '', component: WalletOverviewComponent },
          { path: 'transactions', component: TransactionsComponent },
          { path: 'send-money', component: SendMoneyComponent },
          { path: 'request-money', component: RequestMoneyComponent }
        ]
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
];
