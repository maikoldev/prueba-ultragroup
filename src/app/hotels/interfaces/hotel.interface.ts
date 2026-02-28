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
  amenities:     string[];
  images:        string[];
  category:      HotelCategory;
  rooms:         Room[];
}

export interface Room {
  id:            string;
  type:          RoomType;
  name:          string;
  description:   string;
  pricePerNight: number;
  capacity:      number;
  available:     number;
  amenities:     string[];
  images:        string[];
  size:          number; // metros cuadrados
}

export enum RoomType {
  Simple = 'Simple',
  Doble = 'Doble',
  Suite = 'Suite',
  Familiar = 'Familiar',
  Presidencial = 'Presidencial'
}

export enum HotelCategory {
  Economico = 'económico',
  Boutique = 'boutique',
  Negocios = 'negocios',
  Lujo = 'lujo'
}
