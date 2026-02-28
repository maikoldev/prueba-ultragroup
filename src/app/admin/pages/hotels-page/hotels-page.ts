import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '@admin/services/admin.service';
import { NotificationService } from '@shared/services/notification.service';
import { Hotel } from '@admin/interfaces/admin.interface';

@Component({
  selector: 'app-hotels-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './hotels-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotelsPageComponent {
  adminService = inject(AdminService);
  notificationService = inject(NotificationService);

  showModal = signal(false);
  editingHotel = signal<Hotel | null>(null);
  formData = {
    name: '',
    location: '',
    description: '',
    rating: 4.0
  };

  openCreateModal(): void {
    this.editingHotel.set(null);
    this.resetForm();
    this.showModal.set(true);
  }

  openEditModal(hotel: Hotel): void {
    this.editingHotel.set(hotel);
    this.formData = {
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      rating: hotel.rating
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  async saveHotel(): Promise<void> {
    if (!this.formData.name || !this.formData.location || !this.formData.description) {
      this.notificationService.warning('Por favor completa los campos requeridos');
      return;
    }

    try {
      if (this.editingHotel()) {
        await this.adminService.updateHotel(this.editingHotel()!.id, {
          ...this.formData
        });
      } else {
        await this.adminService.addHotel({
          ...this.formData,
          images: [],
          isActive: true,
          rooms: []
        });
      }
      this.closeModal();
    } catch (error) {
      console.error('Error al guardar hotel:', error);
    }
  }

  toggleHotel(id: string): void {
    this.adminService.toggleHotel(id);
  }

  async deleteHotel(id: string): Promise<void> {
    if (confirm('¿Estás seguro de que deseas eliminar este hotel?')) {
      try {
        await this.adminService.deleteHotel(id);
      } catch (error) {
        console.error('Error al eliminar hotel:', error);
      }
    }
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      location: '',
      description: '',
      rating: 4.0
    };
  }
}
