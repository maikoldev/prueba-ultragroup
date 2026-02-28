import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { adminGuard } from '@shared/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page').then(m => m.LoginPageComponent)
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'hotels',
        loadComponent: () =>
          import('./pages/hotels-page/hotels-page').then(
            m => m.HotelsPageComponent
          )
      },
      {
        path: 'rooms',
        loadComponent: () =>
          import('./pages/rooms-page/rooms-page').then(m => m.RoomsPageComponent)
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./pages/reservations-page/reservations-page').then(
            m => m.ReservationsPageComponent
          )
      },
      {
        path: '',
        redirectTo: 'hotels',
        pathMatch: 'full'
      }
    ]
  }
];
