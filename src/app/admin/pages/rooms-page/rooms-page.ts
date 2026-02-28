import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '@admin/services/admin.service';
import { NotificationService } from '@shared/services/notification.service';
import { Room, Hotel } from '@admin/interfaces/admin.interface';

@Component({
  selector: 'app-rooms-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsPageComponent {
  adminService = inject(AdminService);
  notificationService = inject(NotificationService);

  showModal = signal(false);
  editingRoom = signal<Room | null>(null);
  formData = {
    hotelId: '',
    roomType: '',
    baseCost: 0,
    tax: 21,
    location: ''
  };

  openCreateModal(): void {
    this.editingRoom.set(null);
    this.resetForm();
    this.showModal.set(true);
  }

  openEditModal(room: Room): void {
    this.editingRoom.set(room);
    this.formData = {
      hotelId: room.hotelId,
      roomType: room.roomType,
      baseCost: room.baseCost,
      tax: room.tax,
      location: room.location
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  async saveRoom(): Promise<void> {
    if (
      !this.formData.hotelId ||
      !this.formData.roomType ||
      !this.formData.baseCost ||
      !this.formData.location
    ) {
      this.notificationService.warning('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      if (this.editingRoom()) {
        await this.adminService.updateRoom(this.editingRoom()!.id, {
          ...this.formData,
          baseCost: Number(this.formData.baseCost),
          tax: Number(this.formData.tax),
          isActive: this.editingRoom()!.isActive
        });
      } else {
        await this.adminService.addRoom({
          ...this.formData,
          baseCost: Number(this.formData.baseCost),
          tax: Number(this.formData.tax),
          isActive: true
        });
      }
      this.closeModal();
    } catch (error) {
      console.error('Error al guardar habitación:', error);
    }
  }

  toggleRoom(id: string): void {
    this.adminService.toggleRoom(id);
  }

  async deleteRoom(id: string): Promise<void> {
    if (confirm('¿Estás seguro de que deseas eliminar esta habitación?')) {
      try {
        await this.adminService.deleteRoom(id);
      } catch (error) {
        console.error('Error al eliminar habitación:', error);
      }
    }
  }

  getHotelName(hotelId: string): string {
    const hotel = this.adminService.hotelsList().find(h => h.id === hotelId);
    return hotel?.name || 'N/A';
  }

  private resetForm(): void {
    this.formData = {
      hotelId: '',
      roomType: '',
      baseCost: 0,
      tax: 21,
      location: ''
    };
  }
}
