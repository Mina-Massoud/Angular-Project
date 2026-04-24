// Owner: Youssef — feature: products/service
// API contract (Postman):
//   GET /api/v1/products
//     query: limit, page, sort, fields, keyword, brand, category[in], price[gte], price[lte]
//   GET /api/v1/products/:id
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  // TODO: Youssef — implement getAll(params), getById(id) with HttpParams for filter/pagination
}
