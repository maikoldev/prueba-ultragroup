import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { Reservation, Hotel, Room } from '../../interfaces/admin.interface';

@Component({
  selector: 'app-reservations-page',
  imports: [CommonModule],
  templateUrl: './reservations-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationsPageComponent {
  adminService = inject(AdminService);
  selectedReservation = signal<Reservation | null>(null);

  viewDetail(reservation: Reservation): void {
    this.selectedReservation.set(reservation);
  }

  closeDetail(): void {
    this.selectedReservation.set(null);
  }

  getHotelName(hotelId: string): string {
    const hotel = this.adminService.hotelsList().find(h => h.id === hotelId);
    return hotel?.name || 'N/A';
  }

  getRoomType(roomId: string): string {
    const room = this.adminService.roomsList().find(r => r.id === roomId);
    return room?.roomType || 'N/A';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      confirmed: '✓ Confirmada',
      pending: '⏳ Pendiente',
      cancelled: '❌ Cancelada'
    };
    return labels[status] || status;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES');
  }
}
