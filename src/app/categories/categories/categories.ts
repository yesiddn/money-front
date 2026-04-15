import { Component, inject, OnInit, signal } from '@angular/core';
import { NavbarService } from '@app/shared/components/navbar/navbar-service';
import { ManageDialogs } from '@app/shared/dialogs/manage-dialogs';
import { Category } from '@app/models/category.interface';
import { ManageCategories } from '../manage-categories';
import { CategoryIcon } from '../category-icon/category-icon';
import { CreateCategories } from '../manage-categories/create-categories/create-categories';
import { EditCategories } from '../manage-categories/edit-categories/edit-categories';

@Component({
  selector: 'app-categories',
  imports: [CategoryIcon, CreateCategories, EditCategories],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private navbarService = inject(NavbarService);
  private manageCategories = inject(ManageCategories);
  private manageDialogs = inject(ManageDialogs);

  categories = signal<Category[]>([]);
  categoryToEdit = signal<Category | null>(null);

  ngOnInit() {
    this.navbarService.setCurrentMenu('categories');

    this.loadCategories();
  }

  loadCategories() {
    this.manageCategories.refreshCategories().subscribe({
      next: (data: Category[]) => {
        this.categories.set(data);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  openEditCategoryDialog(category: Category) {
    this.categoryToEdit.set(category);
    this.manageDialogs.showEditCategoryDialog();
  }

  handleNewCategory(newCategory: Category) {
    this.categories.update((categories) => [...categories, newCategory]);
  }

  handleUpdatedCategory(updatedCategory: Category) {
    this.categories.update((categories) =>
      categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
    );
  }

  handleDeletedCategory(deletedId: number) {
    this.categories.update((categories) => categories.filter((c) => c.id !== deletedId));
  }
}
