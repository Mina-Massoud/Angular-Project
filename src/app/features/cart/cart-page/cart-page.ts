// Owner: Ahmed Gabr — feature: cart/page
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
  // TODO: Ahmed Gabr — load cart, update qty, remove item, clear cart, checkout link
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  cartInfo: Cart | null = null;
  isLoading = false;
  isClearing = false;

  // Track operations per product ID to prevent race conditions and double-clicks
  updatingItems: Record<string, boolean> = {};

  ngOnInit() {
    this.loadCart();
  }


  // load Cart
  loadCart() {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cartInfo = res;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toast.error('Failed to load cart');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }


  // remove Item

  removeItem(id: string) {
    if (this.updatingItems[id]) return;

    // Set loading state for this item
    this.updatingItems[id] = true;
    this.cdr.markForCheck();

    this.cartService.removeItem(id).subscribe({
      next: (res) => {
        // Single source of truth from backend
        this.cartInfo = res;
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

  // Update Quantity

  updateProduct(id: string, count: number) {
    // Prevent updating to 0 or sending multiple requests for the same item
    if (count < 1 || this.updatingItems[id]) return;

    this.updatingItems[id] = true;
    this.cdr.markForCheck();

    this.cartService.updateQuantity(id, count).subscribe({
      next: (res) => {
        this.cartInfo = res;
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


  // Clear Cart

  // clearCart() {
  //   if (this.isClearing) return;

  //   this.isClearing = true;
  //   this.cdr.markForCheck();

  //   this.cartService.clearCart().subscribe({
  //     next: () => {
  //       this.toast.success('Cart cleared');
  //       if (this.cartInfo) {
  //         this.cartInfo = {
  //           ...this.cartInfo,
  //           data: { ...this.cartInfo.data, products: [] }
  //         };
  //       }
  //       this.isClearing = false;
  //       this.cdr.markForCheck();
  //     },
  //     error: () => {
  //       this.toast.error('Failed to clear cart');
  //       this.isClearing = false;
  //       this.cdr.markForCheck();
  //     }
  //   });
  // }

  clearCart() {
    if (this.isClearing) return;

    this.isClearing = true;
    this.cdr.markForCheck();

    this.cartService.clearCart().subscribe({
      next: () => {
        this.toast.success('Cart cleared');

        if (this.cartInfo) {
          this.cartInfo = {
            ...this.cartInfo,
            numOfCartItems: 0, // ✅ fix
            data: {
              ...this.cartInfo.data,
              products: [],     // ✅ fix
              totalCartPrice: 0 // ✅ fix
            }
          };
        }

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




