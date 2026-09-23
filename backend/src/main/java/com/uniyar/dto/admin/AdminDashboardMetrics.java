package com.uniyar.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardMetrics {
    private long totalBuildings;
    private long totalRooms;
    private long totalFaculty;
    private long activeMaintenanceCount;
    private long pendingIssueReportsCount;
    private long upcomingEventsCount;
    private long activeFoodOutletsCount;
    private long totalAnnouncementsCount;
    private long totalUsersCount;
}
