import { RoomType } from "./roomtype";

// Interface to handle Room details in typescript only.
export interface Room {
    id: number;
    capacity: number;
    roomType: RoomType;
    roomNumber: number;
    pricePerNight: number;
    facilities: string[] | [] | null; //Nullable since there are no set facilities
  }

  //Interface to create rooms in typescript
  export interface CreateRoomDTO {
    capacity: number;
    roomTypeId: number;
    roomNumber: number;
    pricePerNight: number;
    facilities: string[] | [] | null; //Nullable since there are no set facilities
  }