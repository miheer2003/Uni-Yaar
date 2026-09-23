package com.uniyar.dto.campus;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MapMarkerDTO {
    private String id;
    private String title;
    private String category; // BUILDING, FOOD, FACILITY, WASHROOM, LAB
    private Double latitude;
    private Double longitude;
    private Long buildingId;
    private String buildingCode;
    private String buildingName;
    private Integer floorNumber;
    private String roomNumber;
    private String status; // OPEN, CLOSED, UNDER_MAINTENANCE
    private String description;
}
