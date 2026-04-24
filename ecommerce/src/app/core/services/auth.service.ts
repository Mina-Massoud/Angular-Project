// Owner: Mina — feature: core/services/auth
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpPayload extends AuthCredentials {
  name: string;
  rePassword: string;
  phone: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = `${environment.baseUrl}/auth`;

  readonly currentUser = signal<User | null>(null);

  signUp(payload: SignUpPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/signup`, payload)
      .pipe(tap((res) => this.persist(res)));
  }

  signIn(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/signin`, credentials)
      .pipe(tap((res) => this.persist(res)));
  }

  forgotPassword(email: string): Observable<{ statusMsg: string; message: string }> {
    return this.http.post<{ statusMsg: string; message: string }>(`${this.base}/forgotPasswords`, {
      email,
    });
  }

  verifyResetCode(resetCode: string): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.base}/verifyResetCode`, { resetCode });
  }

  resetPassword(payload: { email: string; newPassword: string }): Observable<AuthResponse> {
    return this.http
      .put<AuthResponse>(`${this.base}/resetPassword`, payload)
      .pipe(tap((res) => this.persist(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/sign-in']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private persist(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    this.currentUser.set(res.user);
  }
}
