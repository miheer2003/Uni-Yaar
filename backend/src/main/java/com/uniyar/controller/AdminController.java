package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.admin.AdminDashboardMetrics;
import com.uniyar.dto.admin.AdminUserResponse;
import com.uniyar.dto.admin.UserRoleUpdateRequest;
import com.uniyar.dto.event.EventResponse;
import com.uniyar.dto.facility.MaintenanceNoticeResponse;
import com.uniyar.dto.announcement.AnnouncementResponse;
import com.uniyar.entity.*;
import com.uniyar.repository.*;
import com.uniyar.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;
    private final EventRepository eventRepository;
    private final AnnouncementRepository announcementRepository;
    private final MaintenanceNoticeRepository maintenanceNoticeRepository;
    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminDashboardMetrics>> getStats() {
        AdminDashboardMetrics metrics = adminService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics, "Admin metrics retrieved"));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getUsers() {
        List<AdminUserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users, "User directory retrieved"));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<AdminUserResponse>> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UserRoleUpdateRequest request
    ) {
        AdminUserResponse updated = adminService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok(ApiResponse.success(updated, "User role updated successfully"));
    }

    @PutMapping("/maintenance/{id}/resolve")
    public ResponseEntity<ApiResponse<Void>> resolveMaintenance(@PathVariable Long id) {
        adminService.resolveMaintenanceNotice(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Maintenance marked as resolved"));
    }

    @PostMapping("/maintenance")
    public ResponseEntity<ApiResponse<MaintenanceNoticeResponse>> createMaintenanceNotice(
            @RequestBody MaintenanceNotice notice
    ) {
        if (notice.getBuilding() != null && notice.getBuilding().getId() != null) {
            notice.setBuilding(buildingRepository.findById(notice.getBuilding().getId()).orElse(null));
        }
        notice.setIsActive(true);
        MaintenanceNotice saved = maintenanceNoticeRepository.save(notice);
        return ResponseEntity.ok(ApiResponse.success(MaintenanceNoticeResponse.fromEntity(saved), "Maintenance notice created"));
    }

    @PostMapping("/events")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @RequestBody Event event
    ) {
        if (event.getStartsAt() == null) {
            event.setStartsAt(LocalDateTime.now().plusDays(2));
        }
        if (event.getEndsAt() == null) {
            event.setEndsAt(event.getStartsAt().plusHours(3));
        }
        if (event.getStatus() == null) {
            event.setStatus(EventStatus.UPCOMING);
        }
        Event saved = eventRepository.save(event);
        return ResponseEntity.ok(ApiResponse.success(EventResponse.fromEntity(saved), "Event created successfully"));
    }

    @PostMapping("/announcements")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> createAnnouncement(
            @RequestBody Announcement announcement
    ) {
        if (announcement.getPriority() == null) {
            announcement.setPriority(AnnouncementPriority.GENERAL);
        }
        if (announcement.getCategory() == null) {
            announcement.setCategory(AnnouncementCategory.ACADEMIC);
        }
        Announcement saved = announcementRepository.save(announcement);
        return ResponseEntity.ok(ApiResponse.success(AnnouncementResponse.fromEntity(saved), "Announcement broadcasted successfully"));
    }
}
