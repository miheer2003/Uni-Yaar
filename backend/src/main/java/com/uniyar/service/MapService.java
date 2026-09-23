package com.uniyar.service;

import com.uniyar.dto.campus.MapMarkerDTO;
import com.uniyar.entity.Building;
import com.uniyar.repository.BuildingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MapService {

    private final BuildingRepository buildingRepository;

    public List<MapMarkerDTO> getMapMarkers(String category) {
        List<MapMarkerDTO> markers = new ArrayList<>();
        List<Building> buildings = buildingRepository.findAll();

        for (Building b : buildings) {
            markers.add(MapMarkerDTO.builder()
                    .id("bldg-" + b.getId())
                    .title(b.getName())
                    .category("BUILDING")
                    .latitude(b.getLatitude())
                    .longitude(b.getLongitude())
                    .buildingId(b.getId())
                    .buildingCode(b.getCode())
                    .buildingName(b.getName())
                    .floorNumber(0)
                    .status("OPEN")
                    .description(b.getDescription())
                    .build());
        }

        if (category != null && !category.equalsIgnoreCase("ALL") && !category.trim().isEmpty()) {
            return markers.stream()
                    .filter(m -> m.getCategory().equalsIgnoreCase(category.trim()))
                    .toList();
        }

        return markers;
    }
}
