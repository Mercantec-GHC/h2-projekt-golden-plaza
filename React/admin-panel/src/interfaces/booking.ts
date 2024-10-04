import { Room } from "./room";

// src/interfaces/booking.ts

export interface Booking {
    id: number;
    checkIn: string;
    checkOut: string;
    price: number;
    isReserved: boolean;
    roomId: number;
    room?: Room;
    userId?: string | null;
  }
  
  export interface CreateBookingDTO {
    checkIn: string;
    checkOut: string;
    roomTypeId: number;
    userId?: string | null;
  }