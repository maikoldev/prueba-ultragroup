import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-room-page',
  imports: [],
  templateUrl: './room-page.html',
})
export class RoomPage {
  roomId = signal('');
}
