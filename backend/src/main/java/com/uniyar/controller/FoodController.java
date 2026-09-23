package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.food.FoodFacilityResponse;
import com.uniyar.dto.food.MenuResponse;
import com.uniyar.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/food-facilities")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

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
}
