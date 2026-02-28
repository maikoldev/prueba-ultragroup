export interface HotelResponse {
  count:  number;
  pages:  number;
  hotels: Hotel[];
}

export interface Hotel {
  id:            string;
  name:          string;
  location:      string;
  rating:        number;
  description:   string;
  images:        string[];
  isActive:      boolean;
  rooms:         Room[];
}

export interface Room {
  id:            string;
  hotel_id:     string;
  type:          RoomType;
  name:          string;
  description:   string;
  pricePerNight: number;
  tax:           number;
  location:      string;
  capacity:      number;
  available:     number;
  amenities:     string[];
  size:          number;
  isActive:      boolean;
}

export enum RoomType {
  Simple = 'Simple',
  Doble = 'Doble',
  Suite = 'Suite',
  Familiar = 'Familiar',
  Presidencial = 'Presidencial'
}
