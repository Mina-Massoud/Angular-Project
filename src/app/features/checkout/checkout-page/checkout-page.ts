// Owner: Mina — feature: checkout/checkout-page
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../cart/services/cart.service';
import { OrdersService } from '../../orders/services/orders.service';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

type PaymentMethod = 'cash' | 'card';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CurrencyFormatPipe],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly orders = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly cart = this.cartService.cart;
  readonly isEmpty = computed(() => !this.cart()?.data?.products?.length);
  readonly submitting = signal(false);
  readonly paymentMethod = signal<PaymentMethod>('cash');

  readonly form = this.fb.nonNullable.group({
    details: ['', [Validators.required, Validators.minLength(4)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+0-9\s-]{7,20}$/)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    if (!this.cart()) {
      this.cartService.getCart().subscribe({ error: () => {} });
    }
    effect(() => {
      if (this.isEmpty() && this.cart() !== null) {
        // cart loaded but empty → bounce back
        this.router.navigateByUrl('/cart');
      }
    });
  }

  setMethod(method: PaymentMethod): void {
    this.paymentMethod.set(method);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please complete the shipping address.');
      return;
    }
    const cartId = this.cart()?.cartId;
    if (!cartId) {
      this.toast.error('Your cart is unavailable. Please reload.');
      return;
    }

    const shippingAddress = this.form.getRawValue();
    this.submitting.set(true);

    if (this.paymentMethod() === 'cash') {
      this.orders.createCashOrder(cartId, shippingAddress).subscribe({
        next: () => {
          this.cartService.clearCart().subscribe({ error: () => {} });
          this.toast.success('Order placed.');
          this.router.navigateByUrl('/checkout/success');
        },
        error: () => this.submitting.set(false),
      });
      return;
    }

    const successUrl = `${window.location.origin}/checkout/success`;
    this.orders.createCheckoutSession(cartId, shippingAddress, successUrl).subscribe({
      next: (res) => {
        const url = res?.session?.url;
        if (url) {
          window.location.href = url;
        } else {
          this.submitting.set(false);
          this.toast.error('Could not start the payment session.');
        }
      },
      error: () => this.submitting.set(false),
    });
  }
}
