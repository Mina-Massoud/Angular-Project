// services/brands.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BrandsResponse } from '../models/brand.model';

@Injectable({ providedIn: 'root' })
export class BrandsService {

  private readonly http    = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getAllBrands(page = 1, limit = 40): Observable<BrandsResponse> {
    return this.http.get<BrandsResponse>(`${this.baseUrl}/brands`, {
      params: { page, limit }
    });
  }
}