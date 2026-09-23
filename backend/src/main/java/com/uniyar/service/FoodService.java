package com.uniyar.service;

import com.uniyar.dto.food.FoodFacilityResponse;
import com.uniyar.dto.food.MenuResponse;
import com.uniyar.entity.*;
import com.uniyar.exception.ResourceNotFoundException;
import com.uniyar.repository.FoodFacilityRepository;
import com.uniyar.repository.MenuItemRepository;
import com.uniyar.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FoodService {

    private final FoodFacilityRepository foodFacilityRepository;
    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;

    public List<FoodFacilityResponse> getAllFacilities() {
        return foodFacilityRepository.findAll().stream()
                .map(this::mapToFacilityResponse)
                .collect(Collectors.toList());
    }

    public FoodFacilityResponse getFacilityById(Long id) {
        FoodFacility facility = foodFacilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food facility not found with id: " + id));
        return mapToFacilityResponse(facility);
    }

    public MenuResponse getFacilityMenu(Long facilityId, LocalDate date) {
        FoodFacility facility = foodFacilityRepository.findById(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Food facility not found with id: " + facilityId));

        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        Menu menu = menuRepository.findByFoodFacilityIdAndMenuDate(facilityId, queryDate)
                .orElse(null);

        List<MenuResponse.MenuItemResponse> itemResponses = new ArrayList<>();
        if (menu != null) {
            itemResponses = menuItemRepository.findByMenuId(menu.getId()).stream()
                    .map(item -> MenuResponse.MenuItemResponse.builder()
                            .id(item.getId())
                            .mealType(item.getMealType())
                            .itemName(item.getItemName())
                            .dietaryTag(item.getDietaryTag())
                            .price(item.getPrice())
                            .description(item.getDescription())
                            .build())
                    .collect(Collectors.toList());
        }

        return MenuResponse.builder()
                .id(menu != null ? menu.getId() : null)
                .foodFacilityId(facility.getId())
                .foodFacilityName(facility.getName())
                .menuDate(queryDate)
                .items(itemResponses)
                .build();
    }

    private FoodFacilityResponse mapToFacilityResponse(FoodFacility f) {
        Building b = f.getBuilding();
        return FoodFacilityResponse.builder()
                .id(f.getId())
                .name(f.getName())
                .type(f.getType())
                .buildingId(b != null ? b.getId() : null)
                .buildingName(b != null ? b.getName() : null)
                .buildingCode(b != null ? b.getCode() : null)
                .latitude(b != null ? b.getLatitude() : null)
                .longitude(b != null ? b.getLongitude() : null)
                .openingTime(f.getOpeningTime())
                .closingTime(f.getClosingTime())
                .status(f.getStatus())
                .description(f.getDescription())
                .build();
    }
}
