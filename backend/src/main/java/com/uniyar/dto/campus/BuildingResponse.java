package com.uniyar.dto.campus;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildingResponse {
    private Long id;
    private Long universityId;
    private String universityName;
    private String name;
    private String code;
    private String description;
    private Double latitude;
    private Double longitude;
    private String address;
    private Integer totalFloors;
    private Integer totalRooms;
}
