package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.facility.*;
import com.uniyar.entity.IssueCategory;
import com.uniyar.entity.IssueStatus;
import com.uniyar.entity.User;
import com.uniyar.repository.UserRepository;
import com.uniyar.service.FacilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
public class FacilityController {

    private final FacilityService facilityService;
    private final UserRepository userRepository;

    @GetMapping("/maintenance")
    public ResponseEntity<ApiResponse<List<MaintenanceNoticeResponse>>> getActiveNotices(
            @RequestParam(required = false) Long buildingId
    ) {
        List<MaintenanceNoticeResponse> notices = facilityService.getActiveNotices(buildingId);
        return ResponseEntity.ok(ApiResponse.success(notices, "Active maintenance notices retrieved"));
    }

    @GetMapping("/maintenance/{id}")
    public ResponseEntity<ApiResponse<MaintenanceNoticeResponse>> getNoticeById(@PathVariable Long id) {
        MaintenanceNoticeResponse notice = facilityService.getNoticeById(id);
        return ResponseEntity.ok(ApiResponse.success(notice, "Notice details retrieved"));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<IssueReportResponse>>> getIssueReports(
            @RequestParam(required = false) IssueCategory category,
            @RequestParam(required = false) IssueStatus status,
            @RequestParam(required = false) Long buildingId
    ) {
        List<IssueReportResponse> reports = facilityService.getIssueReports(category, status, buildingId);
        return ResponseEntity.ok(ApiResponse.success(reports, "Issue reports retrieved"));
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<ApiResponse<IssueReportResponse>> getIssueById(@PathVariable Long id) {
        IssueReportResponse report = facilityService.getIssueById(id);
        return ResponseEntity.ok(ApiResponse.success(report, "Issue details retrieved"));
    }

    @PostMapping("/reports")
    public ResponseEntity<ApiResponse<IssueReportResponse>> submitReport(
            @Valid @RequestBody IssueReportRequest request,
            Authentication authentication
    ) {
        User currentUser = null;
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            currentUser = userRepository.findByEmail(authentication.getName()).orElse(null);
        }

        IssueReportResponse response = facilityService.submitReport(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response, "Issue reported successfully!"));
    }

    @PostMapping("/reports/{id}/upvote")
    public ResponseEntity<ApiResponse<IssueReportResponse>> upvoteIssue(@PathVariable Long id) {
        IssueReportResponse report = facilityService.upvoteIssue(id);
        return ResponseEntity.ok(ApiResponse.success(report, "Upvoted issue report"));
    }

    @PatchMapping("/reports/{id}/status")
    public ResponseEntity<ApiResponse<IssueReportResponse>> updateIssueStatus(
            @PathVariable Long id,
            @Valid @RequestBody IssueStatusUpdateRequest request
    ) {
        IssueReportResponse report = facilityService.updateIssueStatus(id, request.getStatus(), request.getStaffNotes());
        return ResponseEntity.ok(ApiResponse.success(report, "Issue status updated successfully"));
    }
}
