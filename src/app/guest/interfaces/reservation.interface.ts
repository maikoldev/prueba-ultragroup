export interface SearchCriteria {
  city: string;
  checkInDate: Date;
  checkOutDate?: Date;
}

export enum DocumentType {
  CC = 'CC',
  CE = 'CE',
  PAS = 'PAS',
}

export enum Gender {
  MALE = 'Hombre',
  FEMALE = 'Mujer',
  OTHER = 'Otro',
}

export interface GuestData {
  fullName: string;
  dateOfBirth: Date;
  gender: Gender;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  phone: string;
}

export interface Reservation {
  id: string;
  hotelId: string;
  roomId: string;
  guestData: GuestData;
  searchCriteria: SearchCriteria;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface ReservationResponse {
  success: boolean;
  message: string;
  reservation?: Reservation;
}
