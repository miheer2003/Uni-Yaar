export interface Faculty {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  departmentId?: number;
  departmentName?: string;
  designation: string;
  subjects?: string;
  officeRoomId?: number;
  officeRoomNumber?: string;
  officeBuildingName?: string;
  officeBuildingCode?: string;
  officeLatitude?: number;
  officeLongitude?: number;
  avatarUrl?: string;
  bio?: string;
}

export interface TimetableEntry {
  id: number;
  facultyId: number;
  facultyName: string;
  roomId?: number;
  roomNumber: string;
  roomName: string;
  buildingName: string;
  buildingCode: string;
  latitude?: number;
  longitude?: number;
  subject: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  indicator: string; // "Scheduled Location"
}
