// Owner: Mina — feature: auth/reset-password
// Two-step flow per Postman collection: verifyResetCode -> resetPassword
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: [
      this.route.snapshot.queryParamMap.get('email') ?? '',
      [Validators.required, Validators.email],
    ],
    resetCode: ['', [Validators.required, Validators.minLength(4)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, resetCode, newPassword } = this.form.getRawValue();
    this.submitting.set(true);
    this.auth
      .verifyResetCode(resetCode)
      .pipe(switchMap(() => this.auth.resetPassword({ email, newPassword })))
      .subscribe({
        next: () => {
          this.toast.success('Password reset. Please sign in.');
          this.router.navigate(['/auth/sign-in']);
        },
        error: () => this.submitting.set(false),
        complete: () => this.submitting.set(false),
      });
  }
}
