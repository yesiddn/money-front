import { Component, effect, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManageCategories } from '@app/categories/manage-categories';
import { Category } from '@app/models/category.interface';
import { ManageDialogs } from '@app/shared/dialogs/manage-dialogs';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-create-categories',
  imports: [ReactiveFormsModule, Dialog, ButtonModule, Message, InputTextModule, Textarea],
  templateUrl: './create-categories.html',
})
export class CreateCategories implements OnInit {
  private fb = inject(FormBuilder);
  private manageDialogs = inject(ManageDialogs);
  private manageCategories = inject(ManageCategories);

  newCategory = output<Category>();

  dialogVisible = false;
  form!: FormGroup;
  formSubmitted = false;

  constructor() {
    effect(() => {
      this.dialogVisible = this.manageDialogs.createCategoryDialogVisibleState();
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

    this.manageCategories.createCategory(this.form.getRawValue()).subscribe({
      next: (newCategory) => {
        this.newCategory.emit(newCategory);
        this.form.reset();
        this.formSubmitted = false;
        this.hideDialog();
      },
      error: (error) => {
        console.error('Error creating category:', error);
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
    this.manageDialogs.hideCreateCategoryDialog();
  }
}
