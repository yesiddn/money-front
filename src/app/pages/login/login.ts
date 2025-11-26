import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  providers: [MessageService],
})
export class Login {
  private fb = inject(FormBuilder);
  messageService = inject(MessageService);
  authService = inject(Auth);
  router = inject(Router);

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

    this.authService
      .login(this.userLoginForm.value.username, this.userLoginForm.value.password)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: '¡Bienvenido de nuevo!',
          });
          this.userLoginForm.reset();
          this.router.navigate(['/']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error de inicio de sesión',
              detail: 'Nombre de usuario o contraseña inválidos.',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.',
            });
          }
          console.error('Login failed:', error);
        }
      });

    this.formSubmitted = false;
  }

  isInvalid(controlName: string) {
    const control = this.userLoginForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}
