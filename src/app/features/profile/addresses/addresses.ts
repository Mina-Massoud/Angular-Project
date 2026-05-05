// Owner: Mostafa Shanab — feature: profile/addresses
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
  private readonly cdr = inject(ChangeDetectorRef);

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
    this.profileService.getAddresses().subscribe({
      next: (res) => {
        this.addresses.set(res.data ?? []);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  submitAddress(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.profileService.addAddress(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.addresses.set(res.data ?? []);
        this.toast.success('Address added');
        this.form.reset();
        this.showForm.set(false);
        this.submitting.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.submitting.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  removeAddress(id: string): void {
    this.deletingId.set(id);
    this.profileService.removeAddress(id).subscribe({
      next: (res) => {
        this.addresses.set(res.data ?? []);
        this.toast.success('Address removed');
        this.deletingId.set(null);
        this.cdr.markForCheck();
      },
      error: () => {
        this.deletingId.set(null);
        this.cdr.markForCheck();
      },
    });
  }
}
