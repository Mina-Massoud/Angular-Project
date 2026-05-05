// Owner: Youssef — feature: products/details
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import { CartService } from '../../cart/services/cart.service';
import { WishlistService } from '../../wishlist/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyFormatPipe, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  product = signal<Product | null>(null);
  isLoading = signal(true);
  hasError = signal(false);
  activeImage = signal<string | null>(null);
  isAddingToCart = signal(false);
  isAddingToWishlist = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      this.hasError.set(true);
      return;
    }

    this.productsService
      .getProductById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.product.set(res);
          this.activeImage.set(res.imageCover);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load product', err);
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }

  setActiveImage(src: string) {
    this.activeImage.set(src);
  }

  addToCart() {
    const p = this.product();
    if (!p || this.isAddingToCart()) return;
    if (!this.requireAuth()) return;
    this.isAddingToCart.set(true);
    this.cartService
      .addToCart(p._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.cartService.openSheet();
          this.isAddingToCart.set(false);
        },
        error: (err: HttpErrorResponse) => {
          if (!isAuthError(err)) {
            this.toast.error('Could not add to bag. Please try again.');
          }
          this.isAddingToCart.set(false);
        },
      });
  }

  addToWishlist() {
    const p = this.product();
    if (!p || this.isAddingToWishlist()) return;
    if (!this.requireAuth()) return;
    this.isAddingToWishlist.set(true);
    this.wishlistService
      .addToWishlist(p._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Saved to wishlist');
          this.isAddingToWishlist.set(false);
        },
        error: (err: HttpErrorResponse) => {
          if (!isAuthError(err)) {
            this.toast.error('Could not save. Please try again.');
          }
          this.isAddingToWishlist.set(false);
        },
      });
  }

  private requireAuth(): boolean {
    if (this.auth.isAuthenticated()) return true;
    this.toast.info('Please sign in to continue.');
    this.router.navigate(['/auth/sign-in'], {
      queryParams: { returnUrl: this.router.url },
    });
    return false;
  }
}

function isAuthError(err: HttpErrorResponse): boolean {
  return err?.status === 401 || err?.status === 403;
}
