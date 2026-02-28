import { Component } from '@angular/core';
import { RoomCard } from "../../components/room-card/room-card";

@Component({
  selector: 'app-room-list',
  imports: [RoomCard],
  templateUrl: './room-list.html',
})
export class RoomList { }
