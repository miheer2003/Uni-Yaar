export type FacilityStatus =
  | 'OPERATIONAL'
  | 'UNDER_MAINTENANCE'
  | 'TEMPORARILY_CLOSED'
  | 'RESTRICTED_ACCESS';

export type IssueCategory =
  | 'PLUMBING'
  | 'ELECTRICAL'
  | 'ELEVATOR'
  | 'HVAC_AC'
  | 'CLEANING'
  | 'NETWORK_WIFI'
  | 'FURNITURE'
  | 'AV_PROJECTOR'
  | 'OTHER';

export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IssueStatus =
  | 'REPORTED'
  | 'IN_REVIEW'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'DISMISSED';

export interface MaintenanceNotice {
  id: number;
  title: string;
  description: string;
  status: FacilityStatus;
  affectedAsset?: string;
  buildingId?: number;
  buildingName?: string;
  buildingCode?: string;
  latitude?: number;
  longitude?: number;
  floorId?: number;
  floorNumber?: number;
  roomId?: number;
  roomNumber?: string;
  roomName?: string;
  alternativeSuggestion?: string;
  estimatedResolutionTime?: string;
  isActive: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface IssueReport {
  id: number;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  buildingId?: number;
  buildingName?: string;
  buildingCode?: string;
  latitude?: number;
  longitude?: number;
  floorId?: number;
  floorNumber?: number;
  roomId?: number;
  roomNumber?: string;
  specificLocation?: string;
  reportedByName: string;
  upvoteCount: number;
  staffNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface IssueReportRequest {
  title: string;
  description: string;
  category: IssueCategory;
  priority?: IssuePriority;
  buildingId?: number;
  floorId?: number;
  roomId?: number;
  specificLocation?: string;
}
