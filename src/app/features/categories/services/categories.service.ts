// Owner: Noura — feature: categories/service
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Category, CategoriesResponse } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly baseUrl = environment.baseUrl;
  private readonly httpClient = inject(HttpClient);

  getAllCategories(
    page: number,
    limit: number,
    keyword?: string,
  ): Observable<CategoriesResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (keyword) {
      params = params.set('keyword', keyword);
    }

    return this.httpClient.get<CategoriesResponse>(`${this.baseUrl}/categories`, { params });
  }

  getCategoryById(id: string): Observable<Category> {
    return this.httpClient
      .get<{ data: Category }>(`${this.baseUrl}/categories/${id}`)
      .pipe(map((res) => res.data));
  }
}
