import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../../hotels/services/hotel.service';
import { ReservationService } from '../../services/reservation.service';
import { Hotel, Room } from '../../../hotels/interfaces/hotel.interface';
import { CopPipe } from '../../../shared/pipes/cop.pipe';
import {
  DocumentType,
  Gender,
  Reservation,
  SearchCriteria,
} from '../../interfaces/reservation.interface';

@Component({
  selector: 'app-reservation-page',
  imports: [CommonModule, ReactiveFormsModule, CopPipe],
  templateUrl: './reservation-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private hotelService = inject(HotelService);
  private reservationService = inject(ReservationService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  reservationForm!: FormGroup;
  hotel = signal<Hotel | null>(null);
  room = signal<Room | null>(null);
  hotelId = signal('');
  roomId = signal('');
  isLoading = signal(false);
  isSubmitting = signal(false);
  notFound = signal(false);

  documentTypes = Object.values(DocumentType);
  genders = Object.values(Gender);

  ngOnInit() {
    this.hotelId.set(this.route.snapshot.paramMap.get('idHotel') || '');
    this.roomId.set(this.route.snapshot.paramMap.get('idRoom') || '');
    this.loadHotel();
    this.initializeForm();
  }

  private loadHotel() {
    this.isLoading.set(true);
    this.hotelService.getHotels().subscribe({
      next: (res) => {
        const found = res.hotels.find((h) => h.id === this.hotelId());
        if (!found) {
          this.notFound.set(true);
          this.isLoading.set(false);
          return;
        }

        this.hotel.set(found);
        const foundRoom = found.rooms.find((r) => r.id === this.roomId());
        if (!foundRoom) {
          this.notFound.set(true);
          this.isLoading.set(false);
          return;
        }

        this.room.set(foundRoom);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading hotel:', err);
        this.notFound.set(true);
        this.isLoading.set(false);
      },
    });
  }

  private initializeForm() {
    this.reservationForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{7,}$/)]],
    });
  }

  onSubmit() {
    if (this.reservationForm.invalid) {
      Object.keys(this.reservationForm.controls).forEach((key) => {
        this.reservationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);

    const formData = this.reservationForm.value;
    const searchCriteria = this.getSearchCriteria();

    const reservation: Reservation = {
      id: `RES-${Date.now()}`,
      hotelId: this.hotelId(),
      roomId: this.roomId(),
      guestData: {
        fullName: formData.fullName,
        dateOfBirth: new Date(formData.dateOfBirth),
        gender: formData.gender,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        email: formData.email,
        phone: formData.phone,
      },
      searchCriteria,
      checkInDate: searchCriteria.checkInDate,
      checkOutDate:
        searchCriteria.checkOutDate || new Date(searchCriteria.checkInDate.getTime() + 86400000),
      totalPrice: this.calculatePrice(),
      createdAt: new Date(),
      status: 'pending',
    };

    this.reservationService.createReservation(reservation).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        sessionStorage.setItem('lastReservation', JSON.stringify(reservation));
        this.router.navigate(['/confirmation', reservation.id]);
      },
      error: (err) => {
        console.error('Error creating reservation:', err);
        this.isSubmitting.set(false);
        alert('Error al crear la reserva. Intenta de nuevo.');
      },
    });
  }

  private getSearchCriteria(): SearchCriteria {
    const stored = sessionStorage.getItem('searchCriteria');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        city: parsed.city,
        checkInDate: new Date(parsed.checkInDate),
        checkOutDate: parsed.checkOutDate ? new Date(parsed.checkOutDate) : undefined,
      };
    }
    return {
      city: this.hotel()?.location || '',
      checkInDate: new Date(),
    };
  }

  calculatePrice(): number {
    const room = this.room();
    if (!room) return 0;

    const searchCriteria = this.getSearchCriteria();
    const checkOut =
      searchCriteria.checkOutDate || new Date(searchCriteria.checkInDate.getTime() + 86400000);
    const nights = Math.ceil(
      (checkOut.getTime() - searchCriteria.checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    return room.pricePerNight * Math.max(nights, 1);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.reservationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.reservationForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${fieldName} es obligatorio`;
    }
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `${fieldName} debe tener al menos ${minLength} caracteres`;
    }
    if (control.hasError('email')) {
      return 'Ingresa un email válido';
    }
    if (control.hasError('pattern')) {
      return 'Ingresa un teléfono válido';
    }
    return '';
  }

  goBack() {
    this.router.navigate(['/hotel', this.hotelId()]);
  }
}
