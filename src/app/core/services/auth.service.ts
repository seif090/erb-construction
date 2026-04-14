import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

// Basic standard decode without external libs to avoid race conditions with install
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch(e) {
    return null;
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'CONTRACTOR' | 'VIEWER';
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Using Angular Signal for reactive user state
  currentUser = signal<User | null>(null);

  constructor() {
    this.checkStoredToken();
  }

  private checkStoredToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
      if (!this.isTokenExpired(token)) {
        const decoded = parseJwt(token);
        if (decoded) {
            this.currentUser.set({
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role
            });
        }
      } else {
        this.logout();
      }
    }
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          const { accessToken, refreshToken, user } = response.data;
          this.setTokens(accessToken, refreshToken);
          this.currentUser.set(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const decoded = parseJwt(token);
    if (!decoded) return true;
    const expirationDate = decoded.exp * 1000;
    return Date.now() > expirationDate;
  }
}
