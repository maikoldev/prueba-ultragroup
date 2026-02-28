import { Routes } from '@angular/router';
import { GuestLayout } from './layouts/guest-layout/guest-layout';
import { RoomPage } from './pages/room-page/room-page';
import { HotelPage } from './pages/hotel-page/hotel-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { RoomList } from './pages/room-list/room-list';
import { SearchPage } from './pages/search-page/search-page';
import { ReservationPage } from './pages/reservation-page/reservation-page';
import { ConfirmationPage } from './pages/confirmation-page/confirmation-page';

export const guestRoutes: Routes = [
  {
    path: '',
    component: GuestLayout,
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: SearchPage,
      },
      {
        path: 'rooms',
        component: RoomList,
      },
      {
        path: 'room/:idRoom',
        component: RoomPage,
      },
      {
        path: 'hotel/:idHotel',
        component: HotelPage,
      },
      {
        path: 'reservation/:idHotel/:idRoom',
        component: ReservationPage,
      },
      {
        path: 'confirmation/:id',
        component: ConfirmationPage,
      },
      {
        path: '**',
        component: NotFoundPage,
      },
    ],
  },
];

export default guestRoutes;
