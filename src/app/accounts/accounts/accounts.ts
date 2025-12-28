import { Component, inject, OnInit, signal } from '@angular/core';
import { NavbarService } from '@app/shared/components/navbar/navbar-service';
import { ManageAccounts } from '../manage-accounts';
import { Account } from '@app/models/record.intereface';
import { AccountIcon } from '../account-icon/account-icon';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-accounts',
  imports: [AccountIcon, DecimalPipe],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts implements OnInit {
  private navbarService = inject(NavbarService);
  private manageAccounts = inject(ManageAccounts);
  private images = [
    './images/clouds.svg',
    './images/adventure.svg',
    './images/travel.svg',
    './images/relax.svg',
    './images/tree-swing.svg',
    './images/dreamer.svg',
    './images/art.svg',
    './images/japan.svg',
    './images/camping.svg',
    './images/snow.svg',
  ];

  accounts = signal<Account[]>([]);

  ngOnInit() {
    this.navbarService.setCurrentMenu('accounts');

    this.loadAccounts();
  }

  loadAccounts() {
    this.manageAccounts.refreshAccounts()
      .subscribe({
        next: (data: Account[]) => {
          this.accounts.set(data);
        },
        error: (error) => {
          console.error('Error fetching accounts:', error);
        }
      });
  }

  openEditAccountDialog(account: Account) {
    console.log('Editing account:', account);
    // this.manageAccounts.openEditAccountDialog(account);
  }

  getImageUrl(account: Account): string {
    const index = account.id % this.images.length;
    return this.images[index];
  }
}
