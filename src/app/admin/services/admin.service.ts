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

  private syncHotelsToLocalStorage(): void {
    const currentData = localStorage.getItem('hotels');
    if (currentData) {
      const parsed = JSON.parse(currentData);
      parsed.hotels = this.hotels();
      parsed.count = this.hotels().length;
      localStorage.setItem('hotels', JSON.stringify(parsed));
    }
  }

  private syncRoomsToLocalStorage(): void {
    const currentData = localStorage.getItem('hotels');
    if (currentData) {
      const parsed = JSON.parse(currentData);
      const hotels = parsed.hotels || [];

      console.log('🔄 Syncing rooms to localStorage...');

      hotels.forEach((hotel: any) => {
        const adminRooms = this.rooms().filter(r => r.hotelId === hotel.id);

        // Inicializar array de rooms si no existe
        if (!hotel.rooms || !Array.isArray(hotel.rooms)) {
          hotel.rooms = [];
        }

        hotel.rooms = adminRooms.map(ar => {
          const existingRoom = hotel.rooms.find((r: any) => r.id === ar.id);

          if (existingRoom) {
            // Actualizar habitación
            return {
              ...existingRoom,
              hotel_id: ar.hotelId,
              pricePerNight: ar.baseCost,
              tax: ar.tax,
              location: ar.location,
              isActive: ar.isActive
            };
          } else {
            // Crear nueva habitación
            return {
              id: ar.id,
              hotel_id: ar.hotelId,
              type: ar.roomType,
              name: ar.roomType,
              description: `Habitación ${ar.roomType}`,
              pricePerNight: ar.baseCost,
              tax: ar.tax,
              location: ar.location,
              capacity: 2,
              available: 5,
              amenities: ['TV', 'Wi-Fi'],
              size: 25,
              isActive: ar.isActive
            };
          }
        });
      });

      parsed.hotels = hotels;
      localStorage.setItem('hotels', JSON.stringify(parsed));
    }
  }

  // Hoteles
  async addHotel(hotel: Omit<Hotel, 'id'>): Promise<void> {
    try {
      this.setLoading(true);
      await this.simulateApiDelay();

      if (!hotel.name || !hotel.location || !hotel.description) {
        throw new Error('Los campos Nombre, Ubicación y Descripción son obligatorios');
      }

      const newHotel: Hotel = {
        ...hotel,
        id: `hotel-${Date.now()}`,
        rooms: []
      };
      this.hotels.update(h => [...h, newHotel]);
      this.syncHotelsToLocalStorage();
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
      this.syncHotelsToLocalStorage();
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
    this.syncHotelsToLocalStorage();
    this.notificationService.success('Estado actualizado');
  }

  async deleteHotel(id: string): Promise<void> {
    try {
      this.setLoading(true);
      await this.simulateApiDelay();
      this.hotels.update(h => h.filter(item => item.id !== id));
      this.syncHotelsToLocalStorage();
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
      this.syncRoomsToLocalStorage();
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
      this.syncRoomsToLocalStorage();
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
    this.syncRoomsToLocalStorage();
    this.notificationService.success('Estado actualizado');
  }

  getRoomsByHotel(hotelId: string): Room[] {
    return this.rooms().filter(r => r.hotelId === hotelId);
  }

  async deleteRoom(id: string): Promise<void> {
    try {
      this.setLoading(true);
      await this.simulateApiDelay();
      this.rooms.update(r => r.filter(item => item.id !== id));
      this.syncRoomsToLocalStorage();
      this.notificationService.success('Habitación eliminada exitosamente');
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
    const hotelsData = localStorage.getItem('hotels');
    if (hotelsData) {
      try {
        const parsed = JSON.parse(hotelsData);
        const hotelsFromStorage = (parsed.hotels || []);
        this.hotels.set(hotelsFromStorage);

        // Cargar rooms desde hotels y mapear al formato admin
        const roomsFromHotels: Room[] = [];
        hotelsFromStorage.forEach((hotel: any) => {
          if (hotel.rooms && Array.isArray(hotel.rooms)) {
            hotel.rooms.forEach((room: any) => {
              roomsFromHotels.push({
                id: room.id,
                hotelId: room.hotel_id || hotel.id,
                roomType: room.name || room.type,
                baseCost: room.pricePerNight || 0,
                tax: room.tax || 19,
                location: room.location || `${room.type} - ${room.size}m²`,
                isActive: room.isActive ?? true,
                createdAt: new Date()
              });
            });
          }
        });
        this.rooms.set(roomsFromHotels);
      } catch (error) {
        console.error('Error loading hotels from localStorage:', error);
        this.hotels.set([]);
        this.rooms.set([]);
      }
    } else {
      // Fallback a datos vacíos si no hay localStorage
      this.hotels.set([]);
      this.rooms.set([]);
    }

    const reservationsData = localStorage.getItem('reservations');
    if (reservationsData) {
      try {
        const reservationsFromStorage = JSON.parse(reservationsData);
        const mappedReservations: Reservation[] = reservationsFromStorage.map((res: any) => ({
          id: res.id,
          hotelId: res.hotelId,
          roomId: res.roomId,
          guestName: res.guestData?.fullName || 'N/A',
          guestEmail: res.guestData?.email,
          guestPhone: res.guestData?.phone,
          guestDocument: res.guestData?.documentNumber,
          guestDocumentType: res.guestData?.documentType,
          checkIn: new Date(res.checkInDate || res.searchCriteria?.checkInDate),
          checkOut: new Date(res.checkOutDate || res.searchCriteria?.checkOutDate),
          totalPrice: res.totalPrice,
          status: res.status || 'confirmed',
          createdAt: new Date(res.createdAt)
        }));
        this.reservations.set(mappedReservations);
      } catch (error) {
        console.error('Error loading reservations:', error);
        this.reservations.set([]);
      }
    } else {
      this.reservations.set([]);
    }
  }
}
