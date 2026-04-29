import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import {HomeComponent} from './pages/home/home.component';
import {WalletComponent} from './pages/wallet/wallet.component';
import {AppLayoutComponent} from './component/shared/layouts/app-layout/app-layout.component';
import {AuthLayoutComponent} from './component/shared/layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'wallet', component: WalletComponent },
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
