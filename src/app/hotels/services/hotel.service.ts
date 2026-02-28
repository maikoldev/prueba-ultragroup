import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../../../envs/env';
import { Observable} from 'rxjs';
import { HotelResponse } from '../interfaces/hotel.interface';
import { HotelRepository } from './hotel.repository';

const { baseUrl } = env;

@Injectable({ providedIn: 'root' })
export class HotelService implements HotelRepository {
  constructor(private http: HttpClient) {}

  getHotels(): Observable<HotelResponse> {
    return this.http.get<HotelResponse>(`${baseUrl}/hotels.json`)
  }

  createHotel(hotel: any) {
    return this.http.post('/api/hotels', hotel);
  }

  updateHotel(id: number, hotel: any) {
    return this.http.put(`/api/hotels/${id}`, hotel);
  }

  deleteHotel(id: number) {
    return this.http.delete(`/api/hotels/${id}`);
  }
}
