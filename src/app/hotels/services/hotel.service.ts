import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HotelResponse, Hotel } from '../interfaces/hotel.interface';
import { HotelRepository } from './hotel.repository';

@Injectable({ providedIn: 'root' })
export class HotelService implements HotelRepository {
  private getHotelsFromStorage(): Hotel[] {
    const data = localStorage.getItem('hotels');
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.hotels || [];
  }

  private saveHotelsToStorage(hotels: Hotel[]): void {
    const currentData = localStorage.getItem('hotels');
    if (currentData) {
      const parsed = JSON.parse(currentData);
      parsed.hotels = hotels;
      parsed.count = hotels.length;
      localStorage.setItem('hotels', JSON.stringify(parsed));
    }
  }

  getHotels(): Observable<HotelResponse> {
    const hotels = this.getHotelsFromStorage();
    const response: HotelResponse = {
      count: hotels.length,
      pages: 1,
      hotels,
    };
    return of(response);
  }

  getHotelById(id: string): Observable<Hotel | null> {
    const hotels = this.getHotelsFromStorage();
    const hotel = hotels.find((h) => h.id === id) || null;
    return of(hotel);
  }

  createHotel(hotel: Hotel): Observable<Hotel> {
    const hotels = this.getHotelsFromStorage();
    const newHotel = { ...hotel, id: `hotel-${Date.now()}` };
    hotels.push(newHotel);
    this.saveHotelsToStorage(hotels);
    return of(newHotel);
  }

  updateHotel(id: string, hotelData: Partial<Hotel>): Observable<Hotel | null> {
    const hotels = this.getHotelsFromStorage();
    const index = hotels.findIndex((h) => h.id === id);
    if (index === -1) return of(null);

    const updated = { ...hotels[index], ...hotelData };
    hotels[index] = updated;
    this.saveHotelsToStorage(hotels);
    return of(updated);
  }

  deleteHotel(id: string): Observable<boolean> {
    const hotels = this.getHotelsFromStorage();
    const filtered = hotels.filter((h) => h.id !== id);
    const deleted = filtered.length < hotels.length;
    if (deleted) {
      this.saveHotelsToStorage(filtered);
    }
    return of(deleted);
  }
}
