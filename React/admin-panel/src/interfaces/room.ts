export interface RoomType {
    id: number;
    roomTypeName: string;
  }
  
  export interface Room {
    id: number;
    capacity: number;
    roomType: RoomType;
    roomNumber: number;
    pricePerNight: number;
    facilities: string[] | [] | null;
  }

  export interface CreateRoomDTO {
    capacity: number;
    roomTypeId: number;
    roomNumber: number;
    pricePerNight: number;
    facilities: string[] | [] | null;
  }