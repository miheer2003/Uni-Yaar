export type EventCategory =
  | 'HACKATHON'
  | 'WORKSHOP'
  | 'CULTURAL'
  | 'SPORTS'
  | 'SEMINAR'
  | 'TECH_TALK'
  | 'CLUB_MEET';

export type EventStatus =
  | 'UPCOMING'
  | 'LIVE_NOW'
  | 'COMPLETED'
  | 'CANCELLED';

export interface EventItem {
  id: number;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  bannerUrl?: string;
  organizer: string;
  registrationUrl?: string;
  capacity?: number;
  registeredCount: number;
  startsAt: string;
  endsAt: string;
  roomId?: number;
  roomNumber?: string;
  roomName?: string;
  buildingId?: number;
  buildingName?: string;
  buildingCode?: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  contactEmail?: string;
  isFeatured?: boolean;
}
