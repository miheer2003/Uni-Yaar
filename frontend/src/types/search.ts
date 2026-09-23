export type SearchItemType =
  | 'BUILDING'
  | 'ROOM'
  | 'FACULTY'
  | 'FOOD_OUTLET'
  | 'EVENT'
  | 'ANNOUNCEMENT'
  | 'MAINTENANCE';

export interface SearchResultItem {
  id: number;
  type: SearchItemType;
  title: string;
  subtitle: string;
  details?: string;
  badge: string;
  targetUrl: string;
  buildingId?: number;
  roomId?: number;
  latitude?: number;
  longitude?: number;
}

export interface SearchResponse {
  query: string;
  totalResults: number;
  results: SearchResultItem[];
}

export interface Bookmark {
  id: number;
  itemType: SearchItemType;
  itemId: number;
  title: string;
  subtitle?: string;
  targetUrl: string;
  createdAt: string;
}

export interface BookmarkRequest {
  itemType: SearchItemType;
  itemId: number;
  title: string;
  subtitle?: string;
  targetUrl: string;
}
