import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Records } from './pages/records/records';
import { Layout } from './shared/components/layout/layout';
import { authGuard } from './guards/auth-guard';
import { redirectGuard } from './guards/redirect-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [redirectGuard],
    title: 'Login'
  },
  {
    path: 'signup',
    component: Signup,
    canActivate: [redirectGuard],
    title: 'Signup'
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: Records,
        title: 'Historial de transacciones'
      }
    ]
  }
];
