import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Records } from './pages/records/records';
import { Layout } from './shared/components/layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    title: 'Login'
  },
  {
    path: 'signup',
    component: Signup,
    title: 'Signup'
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Records,
        title: 'Historia de transacciones'
      }
    ]
  }
];
