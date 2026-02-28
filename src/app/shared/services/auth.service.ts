import { Injectable, signal } from '@angular/core';
import { env } from '@env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'admin_authenticated';
  private isAuthenticatedSignal = signal(this.loadAuthState());

  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  private loadAuthState(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  login(password: string): boolean {
    if (password === env.adminPassword) {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      this.isAuthenticatedSignal.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.isAuthenticatedSignal.set(false);
  }
}
