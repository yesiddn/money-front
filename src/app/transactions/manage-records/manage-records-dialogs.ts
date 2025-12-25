import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManageRecordsDialogs {
  private createRecordDialogVisible = signal(false);
  private editRecordDialogVisible = signal(false);

  createRecordDialogVisibleState = this.createRecordDialogVisible.asReadonly();
  editRecordDialogVisibleState = this.editRecordDialogVisible.asReadonly();

  showCreateRecordDialog() {
    this.createRecordDialogVisible.set(true);
  }

  hideCreateRecordDialog() {
    this.createRecordDialogVisible.set(false);
  }

  showEditRecordDialog() {
    this.editRecordDialogVisible.set(true);
  }

  hideEditRecordDialog() {
    this.editRecordDialogVisible.set(false);
  }
}
