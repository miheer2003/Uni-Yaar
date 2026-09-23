package com.uniyar.dto.campus;

import com.uniyar.entity.RoomType;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private Long id;
    private Long floorId;
    private Integer floorNumber;
    private String floorName;
    private Long buildingId;
    private String buildingName;
    private String buildingCode;
    private String roomNumber;
    private String name;
    private RoomType roomType;
    private Integer capacity;
    private String indoorDescription;
}
