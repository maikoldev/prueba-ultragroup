import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, ReservationResponse } from '../interfaces/reservation.interface';
import { env } from '../../../envs/env';

const { baseUrl } = env;

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);

  createReservation(reservation: Reservation): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(`${baseUrl}/reservations`, reservation);
  }

  getReservation(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${baseUrl}/reservations/${id}`);
  }

  getReservationsByEmail(email: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${baseUrl}/reservations/email/${email}`);
  }

  cancelReservation(id: string): Observable<ReservationResponse> {
    return this.http.delete<ReservationResponse>(`${baseUrl}/reservations/${id}`);
  }
}
