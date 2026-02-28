import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminService);
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar un hotel', async () => {
    const initialCount = service.hotelsList().length;

    await service.addHotel({
      name: 'Hotel Test',
      location: 'Bogotá',
      email: 'test@hotel.com',
      phone: '123456789',
      description: 'Hotel de prueba',
      isActive: true
    });

    expect(service.hotelsList().length).toBe(initialCount + 1);
  });

  it('debería rechazar hotel sin nombre', async () => {
    try {
      await service.addHotel({
        name: '',
        location: 'Bogotá',
        email: 'test@hotel.com',
        phone: '123',
        description: '',
        isActive: true
      });
      expect(false).toBe(true); // No debería llegar acá
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('debería actualizar un hotel', async () => {
    const hotelId = service.hotelsList()[0].id;
    await service.updateHotel(hotelId, { name: 'Hotel Modificado' });
    expect(service.getHotel(hotelId)?.name).toBe('Hotel Modificado');
  });

  it('debería eliminar un hotel', async () => {
    const initialCount = service.hotelsList().length;
    await service.deleteHotel(service.hotelsList()[0].id);
    expect(service.hotelsList().length).toBe(initialCount - 1);
  });

  it('debería agregar una habitación', async () => {
    const hotelId = service.hotelsList()[0].id;
    const initialCount = service.roomsList().length;

    await service.addRoom({
      hotelId,
      roomType: 'Suite',
      baseCost: 150,
      tax: 19,
      location: 'Piso 5',
      isActive: true
    });

    expect(service.roomsList().length).toBe(initialCount + 1);
  });

  it('debería rechazar habitación con costo negativo', async () => {
    try {
      await service.addRoom({
        hotelId: service.hotelsList()[0].id,
        roomType: 'Suite',
        baseCost: -100,
        tax: 19,
        location: 'Piso 1',
        isActive: true
      });
      expect(false).toBe(true); // No debería llegar acá
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('debería obtener habitaciones por hotel', () => {
    const hotelId = service.hotelsList()[0].id;
    const rooms = service.getRoomsByHotel(hotelId);
    expect(rooms.length).toBeGreaterThan(0);
  });
});
