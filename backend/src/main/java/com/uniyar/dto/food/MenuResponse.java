package com.uniyar.dto.food;

import com.uniyar.entity.MealType;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuResponse {
    private Long id;
    private Long foodFacilityId;
    private String foodFacilityName;
    private LocalDate menuDate;
    private List<MenuItemResponse> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MenuItemResponse {
        private Long id;
        private MealType mealType;
        private String itemName;
        private String dietaryTag;
        private Double price;
        private String description;
    }
}
