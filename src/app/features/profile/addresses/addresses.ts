// Owner: Mostafa Shanab — feature: profile/addresses
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { Address, ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './addresses.html',
  styleUrl: './addresses.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Addresses implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  addresses = signal<Address[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  submitting = signal(false);
  deletingId = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    alias: ['', Validators.required],
    details: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
    city: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.isLoading.set(true);
    this.profileService
      .getAddresses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.addresses.set(res.data ?? []);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load addresses', err);
          this.toast.error('Failed to load addresses');
          this.isLoading.set(false);
        },
      });
  }

  submitAddress(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.profileService
      .addAddress(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.addresses.set(res.data ?? []);
          this.toast.success('Address added');
          this.form.reset();
          this.showForm.set(false);
          this.submitting.set(false);
        },
        error: (err) => {
          console.error('Failed to add address', err);
          this.toast.error('Failed to add address');
          this.submitting.set(false);
        },
      });
  }

  removeAddress(id: string): void {
    if (typeof window !== 'undefined' && !window.confirm('Remove this address?')) {
      return;
    }
    this.deletingId.set(id);
    this.profileService
      .removeAddress(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.addresses.set(res.data ?? []);
          this.toast.success('Address removed');
          this.deletingId.set(null);
        },
        error: (err) => {
          console.error('Failed to remove address', err);
          this.toast.error('Failed to remove address');
          this.deletingId.set(null);
        },
      });
  }
}
