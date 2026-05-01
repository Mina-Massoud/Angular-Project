import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Category, CategoriesResponse } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {

  private baseUrl = environment.baseUrl;
  private httpClient = inject(HttpClient);

  getAllCategories(page: number, limit: number, keyword?: string): Observable<CategoriesResponse> {

    let params: any = {
      page,
      limit
    };

    if (keyword) {
      params.keyword = keyword;
    }

    return this.httpClient
      .get<CategoriesResponse>(`${this.baseUrl}/categories`, { params });
  }

  getCategoryById(id: string): Observable<Category> {
    return this.httpClient
      .get<{ data: Category }>(`${this.baseUrl}/categories/${id}`)
      .pipe(map(res => res.data));
  }
}