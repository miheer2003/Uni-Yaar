package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.campus.BuildingRequest;
import com.uniyar.dto.campus.BuildingResponse;
import com.uniyar.dto.campus.FloorResponse;
import com.uniyar.dto.campus.RoomResponse;
import com.uniyar.service.CampusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
@RequiredArgsConstructor
public class CampusController {

    private final CampusService campusService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BuildingResponse>>> getAllBuildings(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<BuildingResponse> buildings = campusService.getAllBuildings(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(buildings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BuildingResponse>> getBuildingById(@PathVariable Long id) {
        BuildingResponse building = campusService.getBuildingById(id);
        return ResponseEntity.ok(ApiResponse.success(building));
    }

    @GetMapping("/{id}/floors")
    public ResponseEntity<ApiResponse<List<FloorResponse>>> getFloorsByBuilding(@PathVariable Long id) {
        List<FloorResponse> floors = campusService.getFloorsByBuilding(id);
        return ResponseEntity.ok(ApiResponse.success(floors));
    }

    @GetMapping("/floors/{floorId}/rooms")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getRoomsByFloor(@PathVariable Long floorId) {
        List<RoomResponse> rooms = campusService.getRoomsByFloor(floorId);
        return ResponseEntity.ok(ApiResponse.success(rooms));
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoomById(@PathVariable Long roomId) {
        RoomResponse room = campusService.getRoomById(roomId);
        return ResponseEntity.ok(ApiResponse.success(room));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BuildingResponse>> createBuilding(@Valid @RequestBody BuildingRequest request) {
        BuildingResponse created = campusService.createBuilding(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Building created successfully"));
    }
}
