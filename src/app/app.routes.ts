import { Routes } from '@angular/router';
import { Signup } from './auth/signup/signup';
import { Records } from './transactions/records/records';
import { Layout } from './shared/components/layout/layout';
import { authGuard } from './guards/auth-guard';
import { redirectGuard } from './guards/redirect-guard';
import { Login } from './auth/login/login';

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
