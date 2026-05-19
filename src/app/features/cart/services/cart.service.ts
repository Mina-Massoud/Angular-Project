import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cart } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private base = `${environment.baseUrl}/cart`;

  cartCount = signal<number>(0);
  cartItemsIds = signal<Set<string>>(new Set());
  cart = signal<Cart | null>(null);
  isSheetOpen = signal(false);

  // The Route API returns populated `product` objects from GET /cart, but
  // only a bare product-id string from POST/PUT mutations. We need the
  // populated shape to render the sheet (title, image, link), so any
  // response that isn't fully populated falls back to a follow-up GET.
  private isPopulated(res: any): boolean {
    const products = res?.data?.products;
    if (!Array.isArray(products) || products.length === 0) return true;
    return typeof products[0]?.product === 'object' && products[0]?.product !== null;
  }

  private syncCartState(res: any) {
    this.cartCount.set(res?.numOfCartItems || 0);
    if (res?.data?.products && Array.isArray(res.data.products)) {
      const ids = res.data.products.map((p: any) => p.product?._id || p.product);
      this.cartItemsIds.set(new Set(ids));
    }
    if (res?.data && this.isPopulated(res)) {
      this.cart.set(res as Cart);
    }
  }

  addToCart(productId: string): Observable<any> {
    const currentIds = new Set(this.cartItemsIds());
    if (!currentIds.has(productId)) {
      currentIds.add(productId);
      this.cartItemsIds.set(currentIds);
      this.cartCount.update((c) => c + 1);
    }

    return this.http.post(this.base, { productId }).pipe(
      tap((res: any) => this.syncCartState(res)),
      switchMap((res: any) => (this.isPopulated(res) ? [res] : this.getCart())),
    );
  }

  updateQuantity(productId: string, count: number): Observable<any> {
    return this.http.put(`${this.base}/${productId}`, { count }).pipe(
      tap((res: any) => this.syncCartState(res)),
      switchMap((res: any) => (this.isPopulated(res) ? [res] : this.getCart())),
    );
  }

  getCart(): Observable<any> {
    return this.http.get(this.base).pipe(tap((res: any) => this.syncCartState(res)));
  }

  removeItem(productId: string): Observable<any> {
    const currentIds = new Set(this.cartItemsIds());
    if (currentIds.has(productId)) {
      currentIds.delete(productId);
      this.cartItemsIds.set(currentIds);
    }

    return this.http.delete(`${this.base}/${productId}`).pipe(
      tap((res: any) => this.syncCartState(res)),
      switchMap((res: any) => (this.isPopulated(res) ? [res] : this.getCart())),
    );
  }

  clearCart(): Observable<any> {
    this.cartItemsIds.set(new Set());
    this.cartCount.set(0);
    this.cart.set(null);

    return this.http.delete(this.base).pipe(
      tap(() => {
        this.cartItemsIds.set(new Set());
        this.cartCount.set(0);
        this.cart.set(null);
      }),
    );
  }

  loadCartCount() {
    this.getCart().subscribe({
      next: () => {},
      error: () => {
        this.cartCount.set(0);
        this.cartItemsIds.set(new Set());
        this.cart.set(null);
      },
    });
  }

  openSheet() {
    this.isSheetOpen.set(true);
  }
  closeSheet() {
    this.isSheetOpen.set(false);
  }
  toggleSheet() {
    this.isSheetOpen.update((v) => !v);
  }
}
