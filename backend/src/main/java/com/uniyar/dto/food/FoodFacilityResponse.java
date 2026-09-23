package com.uniyar.dto.food;

import com.uniyar.entity.FoodType;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodFacilityResponse {
    private Long id;
    private String name;
    private FoodType type;
    private Long buildingId;
    private String buildingName;
    private String buildingCode;
    private Double latitude;
    private Double longitude;
    private String openingTime;
    private String closingTime;
    private String status;
    private String description;
}
