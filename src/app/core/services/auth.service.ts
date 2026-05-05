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

  constructor() {
    // Rehydrate the current user from the stored JWT on app boot,
    // otherwise pages like /orders see null and bail before hitting the API.
    const token = this.getToken();
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded) {
        this.currentUser.set(decoded as unknown as User);
      }
    }
  }

  updateCurrentUser(user: User): void {
    this.currentUser.set(user);
  }

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
    if (res.user) {
      this.currentUser.set(res.user);
    } else {
      const decoded = decodeJwt(res.token);
      if (decoded) this.currentUser.set(decoded as unknown as User);
    }
  }
}

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
