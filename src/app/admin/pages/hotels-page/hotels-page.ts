import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Hotel } from '../../interfaces/admin.interface';

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
    email: '',
    phone: '',
    description: ''
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
      email: hotel.email,
      phone: hotel.phone,
      description: hotel.description
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  async saveHotel(): Promise<void> {
    if (!this.formData.name || !this.formData.location || !this.formData.email) {
      this.notificationService.warning('Por favor completa los campos requeridos');
      return;
    }

    try {
      if (this.editingHotel()) {
        await this.adminService.updateHotel(this.editingHotel()!.id, {
          ...this.formData,
          isActive: this.editingHotel()!.isActive
        });
      } else {
        await this.adminService.addHotel({
          ...this.formData,
          isActive: true
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
      email: '',
      phone: '',
      description: ''
    };
  }
}
