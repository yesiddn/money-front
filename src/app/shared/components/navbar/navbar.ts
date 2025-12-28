import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ManageRecordsDialogs } from '@app/transactions/manage-records/manage-records-dialogs';
import { NavbarService } from './navbar-service';
import { ManageDialogs } from '@app/shared/dialogs/manage-dialogs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {
  private navbarService = inject(NavbarService);
  private manageRecordsDialogs = inject(ManageRecordsDialogs);
  private manageDialogs = inject(ManageDialogs);

  menuSelected = this.navbarService.currentMenu;

  showCreateDialog() {
    if (this.menuSelected() === 'accounts') {
      this.manageDialogs.showCreateAccountDialog();
      return;
    }

    this.manageRecordsDialogs.showCreateRecordDialog();
  }
}
