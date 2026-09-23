package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.campus.MapMarkerDTO;
import com.uniyar.service.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
public class MapController {

    private final MapService mapService;

    @GetMapping("/markers")
    public ResponseEntity<ApiResponse<List<MapMarkerDTO>>> getMarkers(
            @RequestParam(required = false) String category) {
        List<MapMarkerDTO> markers = mapService.getMapMarkers(category);
        return ResponseEntity.ok(ApiResponse.success(markers));
    }
}
