import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { Auth } from '../auth';
import { Router, RouterLink } from '@angular/router';
import { SignupErrorResponse } from '../../models/auth.model';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, ToastModule, MessageModule, RouterLink],
  templateUrl: './signup.html',
  providers: [MessageService]
})
export class Signup {
private fb = inject(FormBuilder);
  messageService = inject(MessageService);
  authService = inject(Auth);
  router = inject(Router);

  signupFormGroup: FormGroup;

  formSubmitted = false;

  constructor() {
    this.signupFormGroup = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (!this.signupFormGroup.valid) return;

    const newUser = this.createNewUserFromForm(this.signupFormGroup.value);

    this.authService.signup(newUser).subscribe({
      next: (response) => {

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Formulario enviado correctamente.',
          life: 3000,
        });
        this.signupFormGroup.reset();
        this.router.navigate(['/']);
      },
      error: (error) => {
        const fieldErrors = error.error as SignupErrorResponse;

        for (const field in fieldErrors) {
          if (fieldErrors.hasOwnProperty(field)) {
            const messages = fieldErrors[field as keyof SignupErrorResponse];
            messages?.forEach((msg) => {
              this.messageService.add({
                severity: 'error',
                summary: `Error en ${field}`,
                detail: msg,
                life: 5000,
              });
            });
          }
        }
      }
    });

    this.formSubmitted = false;
  }

  isInvalid(controlName: string) {
    const control = this.signupFormGroup.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  private createNewUserFromForm(formValue: any) {
    return {
      username: formValue.username,
      first_name: formValue.firstName,
      last_name: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      confirm_password: formValue.confirmPassword,
    };
  }
}
