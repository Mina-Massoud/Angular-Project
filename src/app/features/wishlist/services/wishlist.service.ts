// Owner: Ahmed Gabr — feature: wishlist/service
// API contract (Postman):
//   POST   /api/v1/wishlist             body: { productId }
//   DELETE /api/v1/wishlist/:productId
//   GET    /api/v1/wishlist
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { Observable, tap } from 'rxjs';
// TODO: Ahmed Gabr — implement add(productId), remove(productId), getUserWishlist()
@Injectable({ providedIn: 'root' })
export class WishlistService {

  private http = inject(HttpClient);
  private base = `${environment.baseUrl}/wishlist`;

  wishlistCount = signal<number>(0);

  addToWishlist(productId: string): Observable<any> {
    return this.http.post(this.base, { productId }).pipe(
      tap((res: any) => {
        // ✅ update count after add
        this.wishlistCount.set(res?.data?.length ?? res?.count ?? 0);
      })
    );
  }

  removeItem(productId: string): Observable<any> {
    return this.http.delete(`${this.base}/${productId}`).pipe(
      tap((res: any) => {
        this.wishlistCount.set(res?.data?.length ?? res?.count ?? 0);
      })
    );
  }

  getWishlist(): Observable<any> {
    return this.http.get(this.base);
  }

  loadWishlistCount() {
    this.getWishlist().subscribe({
      next: (res: any) => {
        this.wishlistCount.set(res?.count || res?.data?.length || 0);
      },
      error: () => {
        this.wishlistCount.set(0);
      }
    });
  }
}
