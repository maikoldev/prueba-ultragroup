import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '@hotels/services/hotel.service';
import { Hotel } from '@hotels/interfaces/hotel.interface';
import { RoomCard } from '../../components/room-card/room-card';
import { SearchCriteria } from '../../interfaces/reservation.interface';

@Component({
  selector: 'app-search-page',
  imports: [CommonModule, ReactiveFormsModule, RoomCard],
  templateUrl: './search-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPage implements OnInit {
  private hotelService = inject(HotelService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  searchForm!: FormGroup;
  hotels = signal<Hotel[]>([]);
  filteredHotels = signal<Hotel[]>([]);
  total = signal(0);
  hasSearched = signal(false);
  isLoading = signal(false);

  ngOnInit() {
    this.initializeForm();
    this.loadAllHotels();
  }

  private initializeForm() {
    this.searchForm = this.formBuilder.group({
      city: ['', Validators.required],
      checkInDate: ['', Validators.required],
      checkOutDate: [''],
    });
  }

  private loadAllHotels() {
    this.isLoading.set(true);
    this.hotelService.getHotels().subscribe({
      next: (res) => {
        const activeHotels = res.hotels.filter(h => h.isActive);
        this.hotels.set(activeHotels);
        this.total.set(activeHotels.length);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading hotels:', err);
        this.isLoading.set(false);
      },
    });
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }

    const { city, checkInDate, checkOutDate } = this.searchForm.value;
    const searchCriteria: SearchCriteria = {
      city: city.toLowerCase(),
      checkInDate: new Date(checkInDate),
      checkOutDate: checkOutDate ? new Date(checkOutDate) : undefined,
    };

    const filtered = this.hotels().filter((hotel) =>
      hotel.location.toLowerCase().includes(searchCriteria.city)
    );

    this.filteredHotels.set(filtered);
    this.hasSearched.set(true);

    // Store search criteria in sessionStorage for later use
    sessionStorage.setItem('searchCriteria', JSON.stringify(searchCriteria));
  }

  onSelectHotel(hotelId: string) {
    this.router.navigate(['/hotel', hotelId]);
  }

  resetSearch() {
    this.searchForm.reset();
    this.hasSearched.set(false);
    this.filteredHotels.set([]);
  }
}
