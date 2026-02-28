export interface Hotel {
  id:            string;
  name:          string;
  location:      string;
  rating:        number;
  description:   string;
  images:        string[];
  isActive:      boolean;
  rooms:         Room[];
}

export interface Room {
  id: string;
  hotelId: string;
  roomType: string;
  baseCost: number;
  tax: number;
  location: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Reservation {
  id: string;
  hotelId: string;
  roomId: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
}
