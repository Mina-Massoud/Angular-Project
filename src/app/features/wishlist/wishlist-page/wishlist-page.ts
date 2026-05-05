import { Component, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { CartService } from '../../cart/services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CurrencyFormatPipe, RouterLink],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistPage {
  private wishlistService = inject(WishlistService);
  cartService = inject(CartService); // Make public for template use
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
    this.cdr.markForCheck();

    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlist = res?.data ? [...res.data] : [];
        this.wishlistService.wishlistCount.set(this.wishlist.length);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.wishlist = [];
        this.wishlistService.wishlistCount.set(0);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  removeItem(productId: string) {
    if (this.updatingItems[productId]) return;
    this.updatingItems[productId] = true;
    this.cdr.markForCheck();

    this.wishlistService.removeItem(productId).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter((item) => item._id !== productId);
        this.wishlistService.wishlistCount.set(this.wishlist.length);
        this.toast.success('Removed from wishlist');
        delete this.updatingItems[productId];
        this.cdr.markForCheck();
      },
      error: () => {
        this.toast.error('Failed to remove item');
        delete this.updatingItems[productId];
        this.cdr.markForCheck();
      },
    });
  }

  addToCart(productId: string) {
    if (this.updatingItems[productId]) return;

    if (this.cartService.cartItemsIds().has(productId)) {
      this.toast.error('Item already in cart');
      return;
    }

    this.updatingItems[productId] = true;
    this.cdr.markForCheck();

    this.cartService.addToCart(productId).subscribe({
      next: () => {
        this.wishlistService.removeItem(productId).subscribe({
          next: () => {
            this.wishlist = this.wishlist.filter((item) => item._id !== productId);

            this.wishlistService.wishlistCount.set(this.wishlist.length);

            this.cartService.loadCartCount();

            this.toast.success('Moved to cart');

            delete this.updatingItems[productId];
            this.cdr.markForCheck();
          },
          error: () => {
            this.toast.error('Added to cart but failed to remove from wishlist');
            delete this.updatingItems[productId];
            this.cdr.markForCheck();
          },
        });
      },
      error: () => {
        this.toast.error('Failed to add to cart');
        delete this.updatingItems[productId];
        this.cdr.markForCheck();
      },
    });
  }
}
