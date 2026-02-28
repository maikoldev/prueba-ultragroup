import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // en milisegundos, 0 = no auto-close
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toasts = signal<Toast[]>([]);
  readonly toastList = this.toasts.asReadonly();

  private toastId = 0;

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  private show(message: string, type: ToastType, duration: number): void {
    const toast: Toast = {
      id: `toast-${++this.toastId}`,
      message,
      type,
      duration
    };

    this.toasts.update(t => [...t, toast]);

    // Auto-remove después de la duración
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  remove(id: string): void {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
