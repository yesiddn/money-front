import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ManageDialogs {
  // Accounts Dialogs
  private createAccountDialogVisible = signal(false);
  private editAccountDialogVisible = signal(false);

  // Accounts Dialog States
  createAccountDialogVisibleState = this.createAccountDialogVisible.asReadonly();
  editAccountDialogVisibleState = this.editAccountDialogVisible.asReadonly();

  // Accounts Dialog Methods
  showCreateAccountDialog() {
    this.createAccountDialogVisible.update(() => true);
  }

  hideCreateAccountDialog() {
    this.createAccountDialogVisible.update(() => false);
  }

  showEditAccountDialog() {
    this.editAccountDialogVisible.update(() => true);
  }

  hideEditAccountDialog() {
    this.editAccountDialogVisible.update(() => false);
  }
}
