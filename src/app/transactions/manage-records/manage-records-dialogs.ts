import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManageRecordsDialogs {
  private createRecordDialogVisible = signal(false);

  createRecordDialogVisibleState = this.createRecordDialogVisible.asReadonly();

  showCreateRecordDialog() {
    this.createRecordDialogVisible.set(true);
  }

  hideCreateRecordDialog() {
    this.createRecordDialogVisible.set(false);
  }
}
