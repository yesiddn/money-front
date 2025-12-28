import { Component, inject, OnInit, signal } from '@angular/core';
import { NavbarService } from '@app/shared/components/navbar/navbar-service';
import { ManageAccounts } from '../manage-accounts';
import { AccountIcon } from '../account-icon/account-icon';
import { DecimalPipe } from '@angular/common';
import { CreateAccounts } from '../manage-accounts/create-accounts/create-accounts';
import { Account } from '@app/models/account.interface';
import { ManageDialogs } from '@app/shared/dialogs/manage-dialogs';
import { EditAccounts } from '../manage-accounts/edit-accounts/edit-accounts';

@Component({
  selector: 'app-accounts',
  imports: [AccountIcon, DecimalPipe, CreateAccounts, EditAccounts],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts implements OnInit {
  private navbarService = inject(NavbarService);
  private manageAccounts = inject(ManageAccounts);
  private manageDialogs = inject(ManageDialogs);
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
  accountToEdit = signal<Account | null>(null);

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
    this.accountToEdit.set(account);
    this.manageDialogs.showEditAccountDialog();
  }

  handleNewAccount(newAccount: Account) {
    this.accounts.update(accounts => [...accounts, newAccount]);
  }

  handleUpdatedAccount(updatedAccount: Account) {
    this.accounts.update(accounts => accounts.map(account =>
      account.id === updatedAccount.id ? updatedAccount : account
    ));
  }

  getImageUrl(account: Account): string {
    const index = account.id % this.images.length;
    return this.images[index];
  }
}
