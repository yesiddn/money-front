import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ManageRecordsDialogs } from '@app/transactions/manage-records/manage-records-dialogs';
import { NavbarService } from './navbar-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {
  private navbarService = inject(NavbarService);
  private manageRecordsDialogs = inject(ManageRecordsDialogs);

  menuSelected = this.navbarService.currentMenu;

  showCreateRecordDialog() {
    this.manageRecordsDialogs.showCreateRecordDialog();
  }
}
