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
  guestEmail: string;
  guestPhone: string;
  guestDocument: string;
  guestDocumentType: DocumentType;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: Date;
}

enum DocumentType {
  CC = 'CC',
  CE = 'CE',
  PAS = 'PAS',
}

enum ReservationStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  CANCELLED = 'cancelled'
}
