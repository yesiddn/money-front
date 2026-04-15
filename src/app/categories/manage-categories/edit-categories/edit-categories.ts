import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManageCategories } from '@app/categories/manage-categories';
import { Category } from '@app/models/category.interface';
import { ManageDialogs } from '@app/shared/dialogs/manage-dialogs';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-edit-categories',
  imports: [
    ReactiveFormsModule,
    Dialog,
    ButtonModule,
    Message,
    InputTextModule,
    Textarea,
    ConfirmDialog,
  ],
  providers: [ConfirmationService],
  templateUrl: './edit-categories.html',
})
export class EditCategories implements OnInit {
  private fb = inject(FormBuilder);
  private manageDialogs = inject(ManageDialogs);
  private manageCategories = inject(ManageCategories);
  private confirmationService = inject(ConfirmationService);

  currentCategory = input<Category | null>(null);
  updatedCategory = output<Category>();
  deletedCategory = output<number>();

  dialogVisible = false;
  form!: FormGroup;
  formSubmitted = false;

  constructor() {
    effect(() => {
      this.dialogVisible = this.manageDialogs.editCategoryDialogVisibleState();

      const category = this.currentCategory();

      if (this.dialogVisible && category) {
        this.form.patchValue({
          name: category.name,
          description: category.description,
        });
      }
    });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  saveCategory() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formSubmitted = false;
      return;
    }

    this.formSubmitted = true;

    const currentCategoryId = this.currentCategory()?.id;

    if (!currentCategoryId) {
      console.error('No category selected for editing.');
      this.formSubmitted = false;
      return;
    }

    this.manageCategories.updateCategory(currentCategoryId, this.form.getRawValue()).subscribe({
      next: (updatedCategory) => {
        this.updatedCategory.emit(updatedCategory);
        this.form.reset();
        this.formSubmitted = false;
        this.hideDialog();
      },
      error: (error) => {
        console.error('Error updating category:', error);
      },
    });
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Eliminar categoría',
      message: '¿Seguro que deseas eliminar esta categoría? Esta acción no se puede deshacer.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => this.deleteCategory(),
    });
  }

  deleteCategory() {
    const currentCategoryId = this.currentCategory()?.id;

    if (!currentCategoryId) {
      console.error('No category selected for deletion.');
      return;
    }

    this.manageCategories.deleteCategory(currentCategoryId).subscribe({
      next: (id) => {
        this.deletedCategory.emit(id);
        this.form.reset();
        this.formSubmitted = false;
        this.hideDialog();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
      },
    });
  }

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  hideDialog() {
    this.form.reset();
    this.formSubmitted = false;
    this.manageDialogs.hideEditCategoryDialog();
  }
}
