import { Component, input } from '@angular/core';

@Component({
  selector: 'app-account-icon',
  imports: [],
  templateUrl: './account-icon.html',
  styleUrl: './account-icon.css',
})
export class AccountIcon {
  size = input<string>('24px');
}
