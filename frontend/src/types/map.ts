export type MapCategory =
  | 'ALL'
  | 'BUILDING'
  | 'FOOD'
  | 'FACILITY'
  | 'WASHROOM'
  | 'LAB';

export interface MapMarker {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  buildingId?: number;
  buildingCode?: string;
  buildingName?: string;
  floorNumber?: number;
  roomNumber?: string;
  status: string;
  description?: string;
}

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
}

export interface RouteData {
  originName: string;
  destinationName: string;
  distanceMeters: number;
  walkingMinutes: number;
  coordinates: [number, number][];
  steps: RouteStep[];
}
