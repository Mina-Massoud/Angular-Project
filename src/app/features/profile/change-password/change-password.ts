// Owner: Mostafa Shanab — feature: profile/change-password
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ProfileService } from '../services/profile.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const rePassword = control.get('rePassword')?.value;
  return password && rePassword && password !== rePassword ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePassword {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.profileService.changeMyPassword(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.success('Password changed. Please sign in again.');
        this.auth.logout();
        this.router.navigate(['/auth/sign-in']);
      },
      error: () => {
        this.submitting.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
