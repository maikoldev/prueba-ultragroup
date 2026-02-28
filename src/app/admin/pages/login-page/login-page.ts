import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { env } from '@env';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  env = env;
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    password: ['', [Validators.required]]
  });

  errorMessage = signal('');
  loading = signal(false);

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    // Simulamos un pequeño delay para UX
    setTimeout(() => {
      const password = this.form.get('password')?.value || '';
      const success = this.authService.login(password);

      if (success) {
        this.router.navigate(['/admin/hotels']);
      } else {
        this.errorMessage.set('Contraseña incorrecta');
      }
      this.loading.set(false);
    }, 500);
  }
}
