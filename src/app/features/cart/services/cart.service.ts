import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private base = `${environment.baseUrl}/cart`;

  cartCount = signal<number>(0);
  cartItemsIds = signal<Set<string>>(new Set());

  // Helper to sync state from API response
  private syncCartState(res: any) {
    this.cartCount.set(res?.numOfCartItems || 0);
    if (res?.data?.products && Array.isArray(res.data.products)) {
      // product could be an object with _id or just the string ID depending on backend population
      const ids = res.data.products.map((p: any) => p.product?._id || p.product);
      this.cartItemsIds.set(new Set(ids));
    }
  }

  addToCart(productId: string): Observable<any> {
    // Optimistic update
    const currentIds = new Set(this.cartItemsIds());
    if (!currentIds.has(productId)) {
      currentIds.add(productId);
      this.cartItemsIds.set(currentIds);
      this.cartCount.update(c => c + 1);
    }

    return this.http.post(this.base, { productId }).pipe(
      tap({
        next: (res: any) => this.syncCartState(res),
        error: () => {
          // Revert on error could be implemented here, but typically we just reload cart state
          // For now, we rely on the next successful operation to fix the state, or we could fetch
        }
      })
    );
  }

  updateQuantity(productId: string, count: number): Observable<any> {
    return this.http.put(`${this.base}/${productId}`, { count }).pipe(
      tap((res: any) => this.syncCartState(res))
    );
  }

  getCart(): Observable<any> {
    return this.http.get(this.base);
  }

  removeItem(productId: string): Observable<any> {
    // Optimistic remove
    const currentIds = new Set(this.cartItemsIds());
    if (currentIds.has(productId)) {
      currentIds.delete(productId);
      this.cartItemsIds.set(currentIds);
    }

    return this.http.delete(`${this.base}/${productId}`).pipe(
      tap((res: any) => this.syncCartState(res))
    );
  }

  clearCart(): Observable<any> {
    this.cartItemsIds.set(new Set());
    this.cartCount.set(0);

    return this.http.delete(this.base).pipe(
      tap(() => {
        this.cartItemsIds.set(new Set());
        this.cartCount.set(0);
      })
    );
  }

  loadCartCount() {
    this.getCart().subscribe({
      next: (res) => {
        this.syncCartState(res);
      },
      error: () => {
        // Do not crash on 404, just clear the cart state
        this.cartCount.set(0);
        this.cartItemsIds.set(new Set());
      }
    });
  }
}
