// Owner: Mina — feature: auth/sign-up
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rePassword: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error(this.firstErrorMessage() ?? 'Please fix the errors below.');
      return;
    }
    const v = this.form.getRawValue();
    if (v.password !== v.rePassword) {
      this.form.controls.rePassword.setErrors({ mismatch: true });
      this.toast.error('Passwords do not match.');
      return;
    }
    this.submitting.set(true);
    this.auth.signUp(v).subscribe({
      next: () => {
        this.toast.success('Account created successfully');
        this.router.navigate(['/']);
      },
      error: () => this.submitting.set(false),
      complete: () => this.submitting.set(false),
    });
  }

  private firstErrorMessage(): string | null {
    const c = this.form.controls;
    if (c.name.invalid) return 'Name must be at least 3 characters.';
    if (c.email.invalid) return 'Enter a valid email address.';
    if (c.password.invalid) return 'Password must be at least 6 characters.';
    if (c.rePassword.invalid) return 'Please confirm your password.';
    if (c.phone.invalid) return 'Enter a valid phone number (10–15 digits, optional +).';
    return null;
  }
}
