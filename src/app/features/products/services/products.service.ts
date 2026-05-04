// Owner: Youssef — feature: products/service
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../models/product.model';

interface ProductsResponse {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: Product[];
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getAllProducts(page: number, limit: number): Observable<ProductsResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    return this.http.get<ProductsResponse>(`${this.baseUrl}/products`, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http
      .get<{ data: Product }>(`${this.baseUrl}/products/${id}`)
      .pipe(map(res => res.data));
  }
}