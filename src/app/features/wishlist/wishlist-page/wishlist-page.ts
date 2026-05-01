
import { WishlistService } from '../services/wishlist.service';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { CartService } from '../../cart/services/cart.service';

import { Component, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
// ... other imports

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CurrencyFormatPipe],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistPage {

  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  wishlist: any[] = [];
  isLoading = false;
  updatingItems: Record<string, boolean> = {};

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.isLoading = true;

    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlist = [...(res.data ?? [])];
        this.wishlistService.wishlistCount.set(this.wishlist.length);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.toast.error('Failed to load wishlist');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  removeItem(productId: string) {
    if (this.updatingItems[productId]) return;
    this.updatingItems[productId] = true;

    this.wishlistService.removeItem(productId).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(item => item._id !== productId);
        this.wishlistService.wishlistCount.set(this.wishlist.length);
        this.toast.success('Removed from wishlist');
        delete this.updatingItems[productId];
        this.cdr.markForCheck();
      },
      error: () => {
        this.toast.error('Failed to remove item');
        delete this.updatingItems[productId];
        this.cdr.markForCheck();
      }
    });
  }

  addToCart(productId: string) {
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        this.toast.success('Added to cart');
        this.wishlist = this.wishlist.filter(item => item._id !== productId);
        this.wishlistService.wishlistCount.set(this.wishlist.length);
        this.cartService.loadCartCount();
        this.cdr.markForCheck();
      },
      error: () => {
        this.toast.error('Failed to add to cart');
      }
    });
  }
}