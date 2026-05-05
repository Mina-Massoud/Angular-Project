// Owner: Mostafa Shanab — feature: profile/profile-page
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ProfileService } from '../services/profile.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
  });

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.form.patchValue({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.profileService.updateMe(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.auth.currentUser.set(res.data);
        this.toast.success('Profile updated successfully');
        this.submitting.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.submitting.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
