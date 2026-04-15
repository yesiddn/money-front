import { Component, input } from '@angular/core';

@Component({
  selector: 'app-category-icon',
  imports: [],
  templateUrl: './category-icon.html',
  styleUrl: './category-icon.css',
})
export class CategoryIcon {
  size = input<string>('24px');
}
