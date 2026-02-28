import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast-notification',
  imports: [CommonModule],
  templateUrl: './toast-notification.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastNotificationComponent {
  notificationService = inject(NotificationService);

  getToastClasses(type: string): string {
    const baseClasses = 'toast toast-start';
    switch (type) {
      case 'success':
        return `${baseClasses}`;
      case 'error':
        return `${baseClasses}`;
      case 'warning':
        return `${baseClasses}`;
      case 'info':
        return `${baseClasses}`;
      default:
        return baseClasses;
    }
  }

  getAlertClasses(type: string): string {
    const baseClasses = 'alert gap-2';
    switch (type) {
      case 'success':
        return `${baseClasses} alert-success`;
      case 'error':
        return `${baseClasses} alert-error`;
      case 'warning':
        return `${baseClasses} alert-warning`;
      case 'info':
        return `${baseClasses} alert-info`;
      default:
        return baseClasses;
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ⓘ';
      default:
        return '';
    }
  }
}
