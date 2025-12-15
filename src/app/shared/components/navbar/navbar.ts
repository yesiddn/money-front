import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ManageRecordsDialogs } from '@app/transactions/manage-records/manage-records-dialogs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {
  private manageRecordsDialogs = inject(ManageRecordsDialogs);

  menuSelected = 'dashboard';

  showCreateRecordDialog() {
    this.manageRecordsDialogs.showCreateRecordDialog();
  }
}
