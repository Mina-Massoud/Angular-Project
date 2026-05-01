import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart.model';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyFormatPipe, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPage {
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  cartInfo: Cart | null = null;
  isLoading = false;
  isClearing = false;
  updatingItems: Record<string, boolean> = {};

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.cartService.getCart().subscribe({
      next: (res) => {
        // Safe mapping
        this.cartInfo = res || null;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // API often returns 404 for empty cart, handle cleanly
        this.cartInfo = null;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  removeItem(id: string) {
    if (this.updatingItems[id]) return;
    this.updatingItems[id] = true;
    this.cdr.markForCheck();

    this.cartService.removeItem(id).subscribe({
      next: (res) => {
        this.cartInfo = res || null;
        delete this.updatingItems[id];
        this.toast.success('Item removed');
        this.cdr.markForCheck();
      },
      error: () => {
        this.toast.error('Failed to remove item');
        delete this.updatingItems[id];
        this.cdr.markForCheck();
      }
    });
  }

  updateProduct(id: string, count: number) {
    if (count < 1 || this.updatingItems[id]) return;
    this.updatingItems[id] = true;
    this.cdr.markForCheck();

    this.cartService.updateQuantity(id, count).subscribe({
      next: (res) => {
        this.cartInfo = res || null;
        delete this.updatingItems[id];
        this.cdr.markForCheck();
      },
      error: () => {
        this.toast.error('Failed to update quantity');
        delete this.updatingItems[id];
        this.cdr.markForCheck();
      }
    });
  }

  clearCart() {
    if (this.isClearing) return;
    this.isClearing = true;
    this.cdr.markForCheck();

    this.cartService.clearCart().subscribe({
      next: () => {
        this.toast.success('Cart cleared');
        this.cartInfo = null;
        this.isClearing = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toast.error('Failed to clear cart');
        this.isClearing = false;
        this.cdr.markForCheck();
      }
    });
  }
}




