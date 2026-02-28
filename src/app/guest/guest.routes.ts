import { Routes } from '@angular/router';
import { GuestLayout } from './layouts/guest-layout/guest-layout';
import { RoomPage } from './pages/room-page/room-page';
import { HotelPage } from './pages/hotel-page/hotel-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { RoomList } from './pages/room-list/room-list';

export const guestRoutes: Routes = [
  {
    path: '',
    component: GuestLayout,
    children: [
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
        path: '**',
        component: NotFoundPage,
      },
    ],
  },
];

export default guestRoutes;
