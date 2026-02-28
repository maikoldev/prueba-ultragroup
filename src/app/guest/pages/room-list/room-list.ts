import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoomCard } from '../../components/room-card/room-card';
import { HotelService } from '../../../hotels/services/hotel.service';
import { Hotel } from '../../../hotels/interfaces/hotel.interface';

@Component({
  selector: 'app-room-list',
  imports: [CommonModule, RoomCard],
  templateUrl: './room-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomList implements OnInit {
  private hotelService = inject(HotelService);
  private router = inject(Router);

  hotels = signal<Hotel[]>([]);
  total = signal(0);

  ngOnInit() {
    this.hotelService.getHotels().subscribe((res) => {
      this.hotels.set(res.hotels);
      this.total.set(res.count);
    });
  }

  onSelectHotel(hotelId: string) {
    this.router.navigate(['/hotel', hotelId]);
  }
}
