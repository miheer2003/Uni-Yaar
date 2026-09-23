package com.uniyar.dto.campus;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FloorResponse {
    private Long id;
    private Long buildingId;
    private String buildingName;
    private Integer floorNumber;
    private String name;
    private Integer roomCount;
    private List<RoomResponse> rooms;
}
