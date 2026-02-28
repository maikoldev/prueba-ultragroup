import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation, ReservationResponse } from '../interfaces/reservation.interface';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly STORAGE_KEY = 'reservations';

  private getReservationsFromStorage(): Reservation[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveReservationsToStorage(reservations: Reservation[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reservations));
  }

  createReservation(reservation: Reservation): Observable<ReservationResponse> {
    const reservations = this.getReservationsFromStorage();

    // Asegurar que la reservación tenga un ID único
    const newReservation: Reservation = {
      ...reservation,
      id: reservation.id || `res-${Date.now()}`
    };

    reservations.push(newReservation);
    this.saveReservationsToStorage(reservations);

    const response: ReservationResponse = {
      success: true,
      message: 'Reserva creada exitosamente',
      reservation: newReservation,
    };

    return of(response);
  }

  getReservation(id: string): Observable<Reservation | null> {
    const reservations = this.getReservationsFromStorage();
    const found = reservations.find(r => r.id === id) || null;
    return of(found);
  }

  getReservationsByEmail(email: string): Observable<Reservation[]> {
    const reservations = this.getReservationsFromStorage();
    const filtered = reservations.filter(r => r.guestData.email === email);
    return of(filtered);
  }

  cancelReservation(id: string): Observable<ReservationResponse> {
    const reservations = this.getReservationsFromStorage();
    const filtered = reservations.filter(r => r.id !== id);
    const deleted = filtered.length < reservations.length;

    if (deleted) {
      this.saveReservationsToStorage(filtered);
      return of({
        success: true,
        message: 'Reserva cancelada exitosamente'
      });
    }

    return of({
      success: false,
      message: 'Reserva no encontrada'
    });
  }
}
