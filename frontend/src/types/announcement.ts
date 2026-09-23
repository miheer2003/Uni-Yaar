export type AnnouncementPriority = 'URGENT' | 'IMPORTANT' | 'GENERAL' | 'CLUB';

export type AnnouncementCategory =
  | 'ACADEMIC'
  | 'PLACEMENT'
  | 'EXAM'
  | 'HOSTEL'
  | 'TRANSPORT'
  | 'ADMINISTRATIVE'
  | 'EMERGENCY';

export type AnnouncementAudience =
  | 'ALL'
  | 'STUDENTS'
  | 'FACULTY'
  | 'HOSTELLERS'
  | 'DEPARTMENT_SPECIFIC';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  category: AnnouncementCategory;
  targetAudience: AnnouncementAudience;
  departmentId?: number;
  departmentName?: string;
  departmentCode?: string;
  authorName: string;
  attachmentUrl?: string;
  externalLink?: string;
  isPinned: boolean;
  createdAt: string;
  expiresAt?: string;
}
