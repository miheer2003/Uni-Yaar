import { Role } from './auth';

export interface AdminDashboardMetrics {
  totalBuildings: number;
  totalRooms: number;
  totalFaculty: number;
  activeMaintenanceCount: number;
  pendingIssueReportsCount: number;
  upcomingEventsCount: number;
  activeFoodOutletsCount: number;
  totalAnnouncementsCount: number;
  totalUsersCount: number;
}

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  universityId?: number;
  universityName?: string;
  createdAt: string;
}
