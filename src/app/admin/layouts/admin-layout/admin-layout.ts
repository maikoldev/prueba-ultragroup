import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '@admin/components/admin-sidebar/admin-sidebar';
import { ToastNotificationComponent } from '@shared/components/toast-notification/toast-notification';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSidebarComponent, ToastNotificationComponent],
  templateUrl: './admin-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/search']);
  }
}
