import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../../hotels/interfaces/hotel.interface';
import { CopPipe } from '../../../shared/pipes/cop.pipe';

@Component({
  selector: 'app-room-card',
  imports: [CommonModule, CopPipe],
  templateUrl: './room-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomCard {
  hotel = input.required<Hotel>();
  selectHotel = output<string>();

  minPrice = computed(() => {
    const rooms = this.hotel().rooms;
    if (!rooms || rooms.length === 0) return 0;
    return Math.min(...rooms.map(room => room.pricePerNight));
  });

  onSelectHotel() {
    this.selectHotel.emit(this.hotel().id);
  }
}
