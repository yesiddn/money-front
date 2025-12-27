import { Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { authGuard } from './guards/auth-guard';
import { redirectGuard } from './guards/redirect-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@app/auth/login/login').then(m => m.Login),
    canActivate: [redirectGuard],
    title: 'Login'
  },
  {
    path: 'signup',
    loadComponent: () => import('@app/auth/signup/signup').then(m => m.Signup),
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
        loadComponent: () => import('@app/transactions/records/records').then(m => m.Records),
        title: 'Historial de transacciones'
      }
    ]
  }
];
