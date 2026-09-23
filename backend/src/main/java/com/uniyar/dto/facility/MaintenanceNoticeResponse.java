package com.uniyar.dto.facility;

import com.uniyar.entity.FacilityStatus;
import com.uniyar.entity.MaintenanceNotice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceNoticeResponse {
    private Long id;
    private String title;
    private String description;
    private FacilityStatus status;
    private String affectedAsset;
    private Long buildingId;
    private String buildingName;
    private String buildingCode;
    private Double latitude;
    private Double longitude;
    private Long floorId;
    private Integer floorNumber;
    private Long roomId;
    private String roomNumber;
    private String roomName;
    private String alternativeSuggestion;
    private String estimatedResolutionTime;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public static MaintenanceNoticeResponse fromEntity(MaintenanceNotice notice) {
        MaintenanceNoticeResponseBuilder builder = MaintenanceNoticeResponse.builder()
                .id(notice.getId())
                .title(notice.getTitle())
                .description(notice.getDescription())
                .status(notice.getStatus())
                .affectedAsset(notice.getAffectedAsset())
                .alternativeSuggestion(notice.getAlternativeSuggestion())
                .estimatedResolutionTime(notice.getEstimatedResolutionTime())
                .isActive(notice.getIsActive())
                .createdAt(notice.getCreatedAt())
                .resolvedAt(notice.getResolvedAt());

        if (notice.getBuilding() != null) {
            builder.buildingId(notice.getBuilding().getId())
                   .buildingName(notice.getBuilding().getName())
                   .buildingCode(notice.getBuilding().getCode())
                   .latitude(notice.getBuilding().getLatitude())
                   .longitude(notice.getBuilding().getLongitude());
        }

        if (notice.getFloor() != null) {
            builder.floorId(notice.getFloor().getId())
                   .floorNumber(notice.getFloor().getFloorNumber());
        }

        if (notice.getRoom() != null) {
            builder.roomId(notice.getRoom().getId())
                   .roomNumber(notice.getRoom().getRoomNumber())
                   .roomName(notice.getRoom().getName());
        }

        return builder.build();
    }
}
