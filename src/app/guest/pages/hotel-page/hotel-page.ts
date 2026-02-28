import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '@hotels/services/hotel.service';
import { Hotel, Room } from '@hotels/interfaces/hotel.interface';
import { CopPipe } from '@shared/pipes/cop.pipe';

@Component({
  selector: 'app-hotel-page',
  imports: [CommonModule, CopPipe],
  templateUrl: './hotel-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelPage implements OnInit {
  private hotelService = inject(HotelService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  hotel = signal<Hotel | null>(null);
  isLoading = signal(false);
  hotelId = signal('');
  notFound = signal(false);
  selectedImageIndex = signal(0);
  selectedRoomImageIndex = signal<Record<string, number>>({});

  // Filtrar solo habitaciones activas
  activeRooms = computed(() => {
    const currentHotel = this.hotel();
    if (!currentHotel) return [];
    return currentHotel.rooms.filter(room => room.isActive);
  });

  ngOnInit() {
    this.hotelId.set(this.route.snapshot.paramMap.get('idHotel') || '');
    this.loadHotel();
  }

  private loadHotel() {
    this.isLoading.set(true);
    this.hotelService.getHotels().subscribe({
      next: (res) => {
        const found = res.hotels.find((h) => h.id === this.hotelId());
        if (!found || !found.isActive) {
          this.notFound.set(true);
          this.isLoading.set(false);
          return;
        }

        this.hotel.set(found);
        // Initialize room image indices
        const indices: Record<string, number> = {};
        found.rooms.forEach((room) => (indices[room.id] = 0));
        this.selectedRoomImageIndex.set(indices);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading hotel:', err);
        this.notFound.set(true);
        this.isLoading.set(false);
      },
    });
  }

  onReserve(roomId: string) {
    this.router.navigate(['/reservation', this.hotelId(), roomId]);
  }

  goBack() {
    this.router.navigate(['/search']);
  }

  selectImage(index: number) {
    this.selectedImageIndex.set(index);
  }

  previousImage() {
    const hotel = this.hotel();
    if (!hotel) return;
    const newIndex = this.selectedImageIndex() - 1;
    this.selectedImageIndex.set(newIndex < 0 ? hotel.images.length - 1 : newIndex);
  }

  nextImage() {
    const hotel = this.hotel();
    if (!hotel) return;
    const newIndex = this.selectedImageIndex() + 1;
    this.selectedImageIndex.set(newIndex >= hotel.images.length ? 0 : newIndex);
  }
}
