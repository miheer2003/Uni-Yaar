package com.uniyar.dto.facility;

import com.uniyar.entity.IssueCategory;
import com.uniyar.entity.IssuePriority;
import com.uniyar.entity.IssueReport;
import com.uniyar.entity.IssueStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueReportResponse {
    private Long id;
    private String title;
    private String description;
    private IssueCategory category;
    private IssuePriority priority;
    private IssueStatus status;
    private Long buildingId;
    private String buildingName;
    private String buildingCode;
    private Double latitude;
    private Double longitude;
    private Long floorId;
    private Integer floorNumber;
    private Long roomId;
    private String roomNumber;
    private String specificLocation;
    private String reportedByName;
    private Integer upvoteCount;
    private String staffNotes;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public static IssueReportResponse fromEntity(IssueReport report) {
        IssueReportResponseBuilder builder = IssueReportResponse.builder()
                .id(report.getId())
                .title(report.getTitle())
                .description(report.getDescription())
                .category(report.getCategory())
                .priority(report.getPriority())
                .status(report.getStatus())
                .specificLocation(report.getSpecificLocation())
                .upvoteCount(report.getUpvoteCount())
                .staffNotes(report.getStaffNotes())
                .createdAt(report.getCreatedAt())
                .resolvedAt(report.getResolvedAt());

        if (report.getReportedBy() != null) {
            builder.reportedByName(report.getReportedBy().getFullName());
        } else {
            builder.reportedByName("Campus Member");
        }

        if (report.getBuilding() != null) {
            builder.buildingId(report.getBuilding().getId())
                   .buildingName(report.getBuilding().getName())
                   .buildingCode(report.getBuilding().getCode())
                   .latitude(report.getBuilding().getLatitude())
                   .longitude(report.getBuilding().getLongitude());
        }

        if (report.getFloor() != null) {
            builder.floorId(report.getFloor().getId())
                   .floorNumber(report.getFloor().getFloorNumber());
        }

        if (report.getRoom() != null) {
            builder.roomId(report.getRoom().getId())
                   .roomNumber(report.getRoom().getRoomNumber());
        }

        return builder.build();
    }
}
