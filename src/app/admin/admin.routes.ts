import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
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
