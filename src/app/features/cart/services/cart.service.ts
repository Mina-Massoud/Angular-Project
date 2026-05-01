import { HttpClient } from '@angular/common/http';
// Owner: Ahmed Gabr — feature: cart/service
// API contract (Postman):
//   POST   /api/v1/cart                body: { productId }
//   PUT    /api/v1/cart/:productId     body: { count }
//   GET    /api/v1/cart
//   DELETE /api/v1/cart/:productId
//   DELETE /api/v1/cart                (clear)
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  // TODO: Ahmed Gabr — implement add, updateQty, remove, clear, getUserCart

  private http = inject(HttpClient);
  private base = `${environment.baseUrl}/cart`;




  //add to cart 
  addToCart(productId: string): Observable<any> {
    return this.http.post(this.base, { productId }).pipe(
      tap((res: any) => {
        this.cartCount.set(res.numOfCartItems || 0);
      })
    );
  }

  // update Product Quantity
  updateQuantity(productId: string, count: number): Observable<any> {
    return this.http.put(`${this.base}/${productId}`, { count }).pipe(
      tap((res: any) => {
        this.cartCount.set(res.numOfCartItems || 0);
      })
    );
  }

  // get logged userCart
  getCart(): Observable<any> {
    return this.http.get(this.base);
  }

  // delete specific item from cart 
  removeItem(productId: string): Observable<any> {
    return this.http.delete(`${this.base}/${productId}`).pipe(
      tap((res: any) => {
        this.cartCount.set(res.numOfCartItems || 0);
      })
    );
  }

  // clear cart
  clearCart(): Observable<any> {
    return this.http.delete(this.base).pipe(
      tap(() => {
        this.cartCount.set(0);
      })
    );
  }
  // show number of cart tem for the all app
  cartCount = signal<number>(0);
  loadCartCount() {
    this.getCart().subscribe({
      next: (res) => {
        this.cartCount.set(res.numOfCartItems || 0);
      },
      error: () => {
        this.cartCount.set(0);
      }
    });
  }

}
