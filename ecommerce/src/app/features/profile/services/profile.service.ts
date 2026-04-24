// Owner: Mostafa Shanab — feature: profile/service
// API contract (Postman):
//   PUT  /api/v1/users/updateMe          body: { name, email, phone }
//   PUT  /api/v1/users/changeMyPassword  body: { currentPassword, password, rePassword }
//   POST /api/v1/addresses               body: { name, details, phone, city }
//   DELETE /api/v1/addresses/:id
//   GET  /api/v1/addresses
//   GET  /api/v1/addresses/:id
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  // TODO: Mostafa Shanab — implement updateMe, changeMyPassword, addresses CRUD
}
