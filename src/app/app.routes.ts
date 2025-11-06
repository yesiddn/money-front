import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';

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
  }
];
