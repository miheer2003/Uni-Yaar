package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.announcement.AnnouncementResponse;
import com.uniyar.entity.AnnouncementAudience;
import com.uniyar.entity.AnnouncementCategory;
import com.uniyar.entity.AnnouncementPriority;
import com.uniyar.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> getAnnouncements(
            @RequestParam(required = false) AnnouncementPriority priority,
            @RequestParam(required = false) AnnouncementCategory category,
            @RequestParam(required = false) AnnouncementAudience audience,
            @RequestParam(required = false) Long departmentId
    ) {
        List<AnnouncementResponse> announcements = announcementService.getAnnouncements(
                priority, category, audience, departmentId
        );
        return ResponseEntity.ok(ApiResponse.success(announcements, "Announcements retrieved successfully"));
    }

    @GetMapping("/urgent")
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> getUrgentAnnouncements() {
        List<AnnouncementResponse> urgent = announcementService.getUrgentAnnouncements();
        return ResponseEntity.ok(ApiResponse.success(urgent, "Urgent announcements retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> getAnnouncementById(@PathVariable Long id) {
        AnnouncementResponse announcement = announcementService.getAnnouncementById(id);
        return ResponseEntity.ok(ApiResponse.success(announcement, "Announcement retrieved"));
    }
}
