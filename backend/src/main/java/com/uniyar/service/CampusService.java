package com.uniyar.service;

import com.uniyar.dto.campus.BuildingRequest;
import com.uniyar.dto.campus.BuildingResponse;
import com.uniyar.dto.campus.FloorResponse;
import com.uniyar.dto.campus.RoomResponse;
import com.uniyar.entity.*;
import com.uniyar.exception.ResourceNotFoundException;
import com.uniyar.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CampusService {

    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;
    private final UniversityRepository universityRepository;

    public Page<BuildingResponse> getAllBuildings(String search, Pageable pageable) {
        Page<Building> page;
        if (search != null && !search.trim().isEmpty()) {
            page = buildingRepository.findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(
                    search.trim(), search.trim(), pageable);
        } else {
            page = buildingRepository.findAll(pageable);
        }
        return page.map(this::mapToBuildingResponse);
    }

    public BuildingResponse getBuildingById(Long id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Building not found with id: " + id));
        return mapToBuildingResponse(building);
    }

    public List<FloorResponse> getFloorsByBuilding(Long buildingId) {
        if (!buildingRepository.existsById(buildingId)) {
            throw new ResourceNotFoundException("Building not found with id: " + buildingId);
        }
        List<Floor> floors = floorRepository.findByBuildingIdOrderByFloorNumberAsc(buildingId);
        return floors.stream().map(floor -> {
            List<RoomResponse> roomResponses = roomRepository.findByFloorIdOrderByRoomNumberAsc(floor.getId())
                    .stream()
                    .map(this::mapToRoomResponse)
                    .collect(Collectors.toList());

            return FloorResponse.builder()
                    .id(floor.getId())
                    .buildingId(floor.getBuilding().getId())
                    .buildingName(floor.getBuilding().getName())
                    .floorNumber(floor.getFloorNumber())
                    .name(floor.getName())
                    .roomCount(roomResponses.size())
                    .rooms(roomResponses)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<RoomResponse> getRoomsByFloor(Long floorId) {
        if (!floorRepository.existsById(floorId)) {
            throw new ResourceNotFoundException("Floor not found with id: " + floorId);
        }
        return roomRepository.findByFloorIdOrderByRoomNumberAsc(floorId)
                .stream()
                .map(this::mapToRoomResponse)
                .collect(Collectors.toList());
    }

    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return mapToRoomResponse(room);
    }

    @Transactional
    public BuildingResponse createBuilding(BuildingRequest request) {
        University university = null;
        if (request.getUniversityId() != null) {
            university = universityRepository.findById(request.getUniversityId()).orElse(null);
        }
        if (university == null) {
            university = universityRepository.findAll().stream().findFirst().orElseGet(() ->
                    universityRepository.save(University.builder()
                            .name("Demo University")
                            .description("Default Campus University")
                            .build())
            );
        }

        Building building = Building.builder()
                .university(university)
                .name(request.getName())
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .totalFloors(request.getTotalFloors() != null ? request.getTotalFloors() : 1)
                .build();

        Building saved = buildingRepository.save(building);
        return mapToBuildingResponse(saved);
    }

    private BuildingResponse mapToBuildingResponse(Building building) {
        int roomCount = 0;
        if (building.getFloors() != null) {
            for (Floor f : building.getFloors()) {
                if (f.getRooms() != null) {
                    roomCount += f.getRooms().size();
                }
            }
        }
        return BuildingResponse.builder()
                .id(building.getId())
                .universityId(building.getUniversity() != null ? building.getUniversity().getId() : null)
                .universityName(building.getUniversity() != null ? building.getUniversity().getName() : null)
                .name(building.getName())
                .code(building.getCode())
                .description(building.getDescription())
                .latitude(building.getLatitude())
                .longitude(building.getLongitude())
                .address(building.getAddress())
                .totalFloors(building.getTotalFloors())
                .totalRooms(roomCount)
                .build();
    }

    private RoomResponse mapToRoomResponse(Room room) {
        Floor floor = room.getFloor();
        Building building = floor != null ? floor.getBuilding() : null;
        return RoomResponse.builder()
                .id(room.getId())
                .floorId(floor != null ? floor.getId() : null)
                .floorNumber(floor != null ? floor.getFloorNumber() : null)
                .floorName(floor != null ? floor.getName() : null)
                .buildingId(building != null ? building.getId() : null)
                .buildingName(building != null ? building.getName() : null)
                .buildingCode(building != null ? building.getCode() : null)
                .roomNumber(room.getRoomNumber())
                .name(room.getName())
                .roomType(room.getRoomType())
                .capacity(room.getCapacity())
                .indoorDescription(room.getIndoorDescription())
                .build();
    }
}
