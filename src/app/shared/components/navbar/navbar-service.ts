import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  currentMenu = signal('dashboard');

  setCurrentMenu(menu: string) {
    this.currentMenu.update(() => menu);
  }
}
