import { Injectable, signal, computed, inject } from '@angular/core';
import { Hotel, Room, Reservation } from '@admin/interfaces/admin.interface';
import { NotificationService } from '@shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private hotels = signal<Hotel[]>([]);
  private rooms = signal<Room[]>([]);
  private reservations = signal<Reservation[]>([]);

  // Estado de carga
  private isLoading = signal(false);

  readonly hotelsList = computed(() => this.hotels());
  readonly roomsList = computed(() => this.rooms());
  readonly reservationsList = computed(() => this.reservations());
  readonly loading = computed(() => this.isLoading());

  // Inyectar NotificationService
  private notificationService = inject(NotificationService);

  constructor() {
    this.loadMockData();
  }

  private setLoading(value: boolean): void {
    this.isLoading.set(value);
  }

  private async simulateApiDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  // Hoteles
  async addHotel(hotel: Omit<Hotel, 'id' | 'createdAt'>): Promise<void> {
    try {
      this.setLoading(true);
      await this.simulateApiDelay();

      if (!hotel.name || !hotel.location || !hotel.email) {
        throw new Error('Los campos Nombre, Ubicación y Email son obligatorios');
      }

      const newHotel: Hotel = {
        ...hotel,
        id: `hotel-${Date.now()}`,
        createdAt: new Date()
      };
      this.hotels.update(h => [...h, newHotel]);
      this.notificationService.success('✓ Hotel creado exitosamente');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear hotel';
      this.notificationService.error(errorMsg);
      throw err;
    } finally {
      this.setLoading(false);
    }
  }

  async updateHotel(id: string, hotel: Partial<Hotel>): Promise<void> {
    try {
      this.setLoading(true);
      await this.simulateApiDelay();

      if (hotel.name && !hotel.name.trim()) {
        throw new Error('El nombre del hotel no puede estar vacío');
      }

      this.hotels.update(h =>
        h.map(item => (item.id === id ? { ...item, ...hotel } : item))
      );
      this.notificationService.success('✓ Hotel actualizado exitosamente');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar hotel';
      this.notificationService.error(errorMsg);
      throw err;
    } finally {
      this.setLoading(false);
    }
  }

  toggleHotel(id: string): void {
    this.hotels.update(h =>
      h.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  }

  async deleteHotel(id: string): Promise<void> {
    try {
      this.setLoading(true);
      await this.simulateApiDelay();
      this.hotels.update(h => h.filter(item => item.id !== id));
      this.notificationService.success('✓ Hotel eliminado exitosamente');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar hotel';
      this.notificationService.error(errorMsg);
      throw err;
    } finally {
      this.setLoading(false);
    }
  }

  getHotel(id: string): Hotel | undefined {
    return this.hotels().find(h => h.id === id);
  }

  // Habitaciones
  async addRoom(room: Omit<Room, 'id' | 'createdAt'>): Promise<void> {
    try {
      this.setLoading(true);
      await this.simulateApiDelay();

      if (!room.hotelId || !room.roomType || !room.baseCost || !room.location) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (room.baseCost <= 0) {
        throw new Error('El costo base debe ser mayor a 0');
      }

      if (room.tax < 0 || room.tax > 100) {
        throw new Error('El impuesto debe estar entre 0 y 100');
      }

      const newRoom: Room = {
        ...room,
        id: `room-${Date.now()}`,
        createdAt: new Date()
      };
      this.rooms.update(r => [...r, newRoom]);
      this.notificationService.success('✓ Habitación creada exitosamente');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear habitación';
      this.notificationService.error(errorMsg);
      throw err;
    } finally {
      this.setLoading(false);
    }
  }

  async updateRoom(id: string, room: Partial<Room>): Promise<void> {
    try {
      this.setLoading(true);
      await this.simulateApiDelay();

      if (room.baseCost && room.baseCost <= 0) {
        throw new Error('El costo base debe ser mayor a 0');
      }

      if (room.tax && (room.tax < 0 || room.tax > 100)) {
        throw new Error('El impuesto debe estar entre 0 y 100');
      }

      this.rooms.update(r =>
        r.map(item => (item.id === id ? { ...item, ...room } : item))
      );
      this.notificationService.success('✓ Habitación actualizada exitosamente');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar habitación';
      this.notificationService.error(errorMsg);
      throw err;
    } finally {
      this.setLoading(false);
    }
  }

  toggleRoom(id: string): void {
    this.rooms.update(r =>
      r.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  }

  getRoomsByHotel(hotelId: string): Room[] {
    return this.rooms().filter(r => r.hotelId === hotelId);
  }

  async deleteRoom(id: string): Promise<void> {
    try {
      this.setLoading(true);
      await this.simulateApiDelay();
      this.rooms.update(r => r.filter(item => item.id !== id));
      this.notificationService.success('✓ Habitación eliminada exitosamente');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar habitación';
      this.notificationService.error(errorMsg);
      throw err;
    } finally {
      this.setLoading(false);
    }
  }

  // Reservas
  getReservationsByHotel(hotelId: string): Reservation[] {
    return this.reservations().filter(r => r.hotelId === hotelId);
  }

  private loadMockData(): void {
    // Mock hotels
    this.hotels.set([
      {
        id: 'hotel-1',
        name: 'Hotel Paraíso',
        location: 'Madrid',
        description: 'Hotel 5 estrellas en el centro de Madrid',
        phone: '+34 912 345 678',
        email: 'contact@hotelparaiso.es',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'hotel-2',
        name: 'Hotel Mediterráneo',
        location: 'Barcelona',
        description: 'Hotel junto a la playa',
        phone: '+34 933 456 789',
        email: 'info@hotelmeditérraneo.es',
        isActive: true,
        createdAt: new Date()
      }
    ]);

    // Mock rooms
    this.rooms.set([
      {
        id: 'room-1',
        hotelId: 'hotel-1',
        roomType: 'Suite Deluxe',
        baseCost: 250,
        tax: 21,
        location: 'Piso 5',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'room-2',
        hotelId: 'hotel-1',
        roomType: 'Habitación Doble',
        baseCost: 120,
        tax: 21,
        location: 'Piso 3',
        isActive: true,
        createdAt: new Date()
      }
    ]);

    // Mock reservations
    this.reservations.set([
      {
        id: 'res-1',
        hotelId: 'hotel-1',
        roomId: 'room-1',
        guestName: 'Juan Pérez',
        checkIn: new Date('2026-03-01'),
        checkOut: new Date('2026-03-05'),
        totalPrice: 1200,
        status: 'confirmed',
        createdAt: new Date()
      }
    ]);
  }
}
