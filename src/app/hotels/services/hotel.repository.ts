import { Observable } from 'rxjs';
import { HotelResponse } from '../interfaces/hotel.interface'

export interface HotelRepository {
  getHotels(): Observable<HotelResponse>;
}
