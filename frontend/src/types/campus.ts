export type RoomType =
  | 'CLASSROOM'
  | 'LAB'
  | 'FACULTY_OFFICE'
  | 'CONFERENCE_HALL'
  | 'AUDITORIUM'
  | 'WASHROOM'
  | 'CANTEEN'
  | 'LIBRARY'
  | 'OTHER';

export interface Room {
  id: number;
  floorId: number;
  floorNumber: number;
  floorName: string;
  buildingId: number;
  buildingName: string;
  buildingCode: string;
  roomNumber: string;
  name: string;
  roomType: RoomType;
  capacity?: number;
  indoorDescription?: string;
}

export interface Floor {
  id: number;
  buildingId: number;
  buildingName: string;
  floorNumber: number;
  name: string;
  roomCount: number;
  rooms?: Room[];
}

export interface Building {
  id: number;
  universityId?: number;
  universityName?: string;
  name: string;
  code: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  totalFloors: number;
  totalRooms: number;
}
