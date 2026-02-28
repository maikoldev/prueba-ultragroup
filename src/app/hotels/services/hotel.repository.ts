import { Observable } from 'rxjs';
import { HotelResponse, Hotel } from '../interfaces/hotel.interface'

export interface HotelRepository {
  getHotels(): Observable<HotelResponse>;
  getHotelById(id: string): Observable<Hotel | null>;
  createHotel(hotel: Hotel): Observable<Hotel>;
  updateHotel(id: string, hotel: Partial<Hotel>): Observable<Hotel | null>;
  deleteHotel(id: string): Observable<boolean>;
}
