import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSidebarComponent, ToastNotificationComponent],
  templateUrl: './admin-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  private router = inject(Router);

  logout(): void {
    this.router.navigate(['/search']);
  }
}
