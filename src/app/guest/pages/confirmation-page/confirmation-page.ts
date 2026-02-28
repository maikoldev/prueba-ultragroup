import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CopPipe } from '../../../shared/pipes/cop.pipe';
import { Reservation } from '../../interfaces/reservation.interface';

@Component({
  selector: 'app-confirmation-page',
  imports: [CommonModule, CopPipe],
  templateUrl: './confirmation-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  reservation = signal<Reservation | null>(null);
  reservationId = signal('');

  ngOnInit() {
    this.reservationId.set(this.route.snapshot.paramMap.get('id') || '');
    this.loadReservation();
  }

  private loadReservation() {
    const stored = sessionStorage.getItem('lastReservation');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Reservation;
        this.reservation.set(parsed);
      } catch (err) {
        console.error('Error parsing reservation:', err);
      }
    }
  }

  printReservation() {
    window.print();
  }

  downloadReservation() {
    const reservation = this.reservation();
    if (!reservation) return;

    const content = this.generatePdfContent(reservation);
    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    element.download = `reserva-${reservation.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  private generatePdfContent(reservation: Reservation): string {
    return `
CONFIRMACIÓN DE RESERVA
========================

Número de reserva: ${reservation.id}
Estado: ${reservation.status.toUpperCase()}
Fecha de creación: ${new Date(reservation.createdAt).toLocaleDateString('es-CO')}

INFORMACIÓN DEL HUÉSPED
========================
Nombre completo: ${reservation.guestData.fullName}
Género: ${reservation.guestData.gender}
Fecha de nacimiento: ${new Date(reservation.guestData.dateOfBirth).toLocaleDateString('es-CO')}
Tipo de documento: ${reservation.guestData.documentType}
Número de documento: ${reservation.guestData.documentNumber}
Email: ${reservation.guestData.email}
Teléfono: ${reservation.guestData.phone}

DETALLES DE LA RESERVA
========================
Fecha de entrada: ${new Date(reservation.checkInDate).toLocaleDateString('es-CO')}
Fecha de salida: ${new Date(reservation.checkOutDate).toLocaleDateString('es-CO')}
Precio total: $${reservation.totalPrice.toLocaleString('es-CO')}

Gracias por tu reserva. Te contactaremos pronto con los detalles de confirmación.
    `;
  }

  goHome() {
    this.router.navigate(['/search']);
  }
}
