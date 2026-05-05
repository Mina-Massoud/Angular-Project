// Owner: Mostafa Shanab — feature: profile/service
// API contract (Postman):
//   PUT  /api/v1/users/updateMe          body: { name, email, phone }
//   PUT  /api/v1/users/changeMyPassword  body: { currentPassword, password, rePassword }
//   POST /api/v1/addresses               body: { name, details, phone, city }
//   DELETE /api/v1/addresses/:id
//   GET  /api/v1/addresses
//   GET  /api/v1/addresses/:id

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface UpdateMePayload {
  name: string;
  email: string;
  phone: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface Address {
  _id: string;
  alias: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddAddressPayload {
  alias: string;
  details: string;
  phone: string;
  city: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.baseUrl;

  updateMe(payload: UpdateMePayload): Observable<any> {
    return this.http.put(`${this.base}/users/updateMe`, payload);
  }

  changeMyPassword(payload: ChangePasswordPayload): Observable<any> {
    return this.http.put(`${this.base}/users/changeMyPassword`, payload);
  }

  getAddresses(): Observable<{ data: Address[] }> {
    return this.http.get<{ data: Address[] }>(`${this.base}/addresses`);
  }

  addAddress(payload: AddAddressPayload): Observable<{ data: Address[] }> {
    return this.http.post<{ data: Address[] }>(`${this.base}/addresses`, payload);
  }

  removeAddress(id: string): Observable<{ data: Address[] }> {
    return this.http.delete<{ data: Address[] }>(`${this.base}/addresses/${id}`);
  }
}
