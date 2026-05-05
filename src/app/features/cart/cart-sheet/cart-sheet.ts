// Owner: Mina — feature: cart/cart-sheet (global slide-out)
import { Component, HostListener, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-cart-sheet',
  standalone: true,
  imports: [RouterLink, CurrencyFormatPipe],
  templateUrl: './cart-sheet.html',
  styleUrl: './cart-sheet.css',
})
export class CartSheet {
  private cartService = inject(CartService);
  private toast = inject(ToastService);

  isOpen = this.cartService.isSheetOpen;
  cart = this.cartService.cart;
  items = computed(() => this.cart()?.data?.products ?? []);
  total = computed(() => this.cart()?.data?.totalCartPrice ?? 0);
  count = computed(() => this.cart()?.numOfCartItems ?? 0);
  updating: Record<string, boolean> = {};

  constructor() {
    effect(() => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = this.isOpen() ? 'hidden' : '';
      }
    });
  }

  close() {
    this.cartService.closeSheet();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isOpen()) this.close();
  }

  inc(productId: string, current: number) {
    if (this.updating[productId]) return;
    this.updating[productId] = true;
    this.cartService.updateQuantity(productId, current + 1).subscribe({
      next: () => (this.updating[productId] = false),
      error: () => (this.updating[productId] = false),
    });
  }

  dec(productId: string, current: number) {
    if (this.updating[productId] || current <= 1) return;
    this.updating[productId] = true;
    this.cartService.updateQuantity(productId, current - 1).subscribe({
      next: () => (this.updating[productId] = false),
      error: () => (this.updating[productId] = false),
    });
  }

  remove(productId: string) {
    if (this.updating[productId]) return;
    this.updating[productId] = true;
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        this.toast.success('Removed from bag');
        this.updating[productId] = false;
      },
      error: () => (this.updating[productId] = false),
    });
  }
}
