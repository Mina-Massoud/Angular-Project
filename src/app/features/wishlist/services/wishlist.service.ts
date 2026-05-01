// Owner: Ahmed Gabr — feature: wishlist/service
// API contract (Postman):
//   POST   /api/v1/wishlist             body: { productId }
//   DELETE /api/v1/wishlist/:productId
//   GET    /api/v1/wishlist
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
// TODO: Ahmed Gabr — implement add(productId), remove(productId), getUserWishlist()
@Injectable({ providedIn: 'root' })
export class WishlistService {


  private http = inject(HttpClient);
  private base = `${environment.baseUrl}/wishlist`;

  //add to wishlist 
  addToWishlist(productId: string): Observable<any> {
    return this.http.post(this.base, { productId });
  }

  // delete specific item from wishlist 
  removeItem(productId: string): Observable<any> {
    return this.http.delete(`${this.base}/${productId}`);
  }

  // get logged wishlist
  getWishlist(): Observable<any> {
    return this.http.get(this.base);
  }


  // count of wishlist items 
  wishlistCount = signal<number>(0);
  loadWishlistCount() {
    this.getWishlist().subscribe({
      next: (res: any) => {
        this.wishlistCount.set(res.count || res.data?.length || 0);
      },
      error: () => {
        this.wishlistCount.set(0);
      }
    });
  }


}
