import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import {HomeComponent} from './pages/home/home.component';
import {WalletComponent} from './pages/wallet/wallet.component';
import {AppLayoutComponent} from './component/shared/layouts/app-layout/app-layout.component';
import {AuthLayoutComponent} from './component/shared/layouts/auth-layout/auth-layout.component';
import {TransactionsComponent} from './pages/wallet/transactions/transactions.component';
import {WalletOverviewComponent} from './pages/wallet/wallet-overview/wallet-overview.component';
import {SendMoneyComponent} from './pages/wallet/send-money/send-money.component';
import {RequestMoneyComponent} from './pages/wallet/request-money/request-money.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
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
