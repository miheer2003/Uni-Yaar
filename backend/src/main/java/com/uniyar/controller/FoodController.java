package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.food.FoodFacilityResponse;
import com.uniyar.dto.food.MenuResponse;
import com.uniyar.entity.*;
import com.uniyar.repository.FoodFacilityRepository;
import com.uniyar.repository.MenuRepository;
import com.uniyar.repository.MenuItemRepository;
import com.uniyar.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/food-facilities")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;
    private final FoodFacilityRepository foodFacilityRepository;
    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodFacilityResponse>>> getAllFacilities() {
        List<FoodFacilityResponse> facilities = foodService.getAllFacilities();
        return ResponseEntity.ok(ApiResponse.success(facilities));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodFacilityResponse>> getFacilityById(@PathVariable Long id) {
        FoodFacilityResponse facility = foodService.getFacilityById(id);
        return ResponseEntity.ok(ApiResponse.success(facility));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<ApiResponse<MenuResponse>> getFacilityMenu(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        MenuResponse menu = foodService.getFacilityMenu(id, date);
        return ResponseEntity.ok(ApiResponse.success(menu));
    }

    // ── Food Staff Management Endpoints ──────────────────────────────────

    @PostMapping("/{facilityId}/menu")
    @PreAuthorize("hasAnyRole('FOOD_STAFF','ADMIN')")
    public ResponseEntity<ApiResponse<MenuResponse>> createMenu(
            @PathVariable Long facilityId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        FoodFacility facility = foodFacilityRepository.findById(facilityId)
                .orElseThrow(() -> new com.uniyar.exception.ResourceNotFoundException("Food facility not found"));
        LocalDate menuDate = date != null ? date : LocalDate.now();
        Menu menu = menuRepository.findByFoodFacilityIdAndMenuDate(facilityId, menuDate)
                .orElseGet(() -> menuRepository.save(Menu.builder().foodFacility(facility).menuDate(menuDate).build()));
        return ResponseEntity.ok(ApiResponse.success(foodService.getFacilityMenu(facilityId, menuDate), "Menu created for " + menuDate));
    }

    @PostMapping("/{facilityId}/menu/items")
    @PreAuthorize("hasAnyRole('FOOD_STAFF','ADMIN')")
    public ResponseEntity<ApiResponse<MenuResponse>> addMenuItem(
            @PathVariable Long facilityId,
            @RequestBody MenuItem item,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        FoodFacility facility = foodFacilityRepository.findById(facilityId)
                .orElseThrow(() -> new com.uniyar.exception.ResourceNotFoundException("Food facility not found"));
        LocalDate menuDate = date != null ? date : LocalDate.now();
        Menu menu = menuRepository.findByFoodFacilityIdAndMenuDate(facilityId, menuDate)
                .orElseGet(() -> menuRepository.save(Menu.builder().foodFacility(facility).menuDate(menuDate).build()));
        item.setId(null);
        item.setMenu(menu);
        menuItemRepository.save(item);
        return ResponseEntity.ok(ApiResponse.success(foodService.getFacilityMenu(facilityId, menuDate), "Menu item added"));
    }

    @DeleteMapping("/menu/items/{itemId}")
    @PreAuthorize("hasAnyRole('FOOD_STAFF','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long itemId) {
        menuItemRepository.deleteById(itemId);
        return ResponseEntity.ok(ApiResponse.success(null, "Menu item deleted"));
    }
}
