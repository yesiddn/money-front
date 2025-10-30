import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule, MessageModule],
  templateUrl: './login.html',
  providers: [MessageService]
})
export class Login {
  private fb = inject(FormBuilder);
  messageService = inject(MessageService);
  authService = inject(Auth);

  userLoginForm: FormGroup;

  formSubmitted = false;

  constructor() {
    this.userLoginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (!this.userLoginForm.valid) return;

    this.authService.login(this.userLoginForm.value.username, this.userLoginForm.value.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Form Submitted',
      life: 3000,
    });
    this.userLoginForm.reset();
    this.formSubmitted = false;
  }

  isInvalid(controlName: string) {
    const control = this.userLoginForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}
