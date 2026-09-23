package com.uniyar.service;

import com.uniyar.dto.facility.*;
import com.uniyar.entity.*;
import com.uniyar.exception.ResourceNotFoundException;
import com.uniyar.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FacilityService {

    private final MaintenanceNoticeRepository maintenanceNoticeRepository;
    private final IssueReportRepository issueReportRepository;
    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;

    @Transactional(readOnly = true)
    public List<MaintenanceNoticeResponse> getActiveNotices(Long buildingId) {
        List<MaintenanceNotice> notices;
        if (buildingId != null) {
            notices = maintenanceNoticeRepository.findByBuildingIdAndIsActiveTrue(buildingId);
        } else {
            notices = maintenanceNoticeRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        }
        return notices.stream()
                .map(MaintenanceNoticeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MaintenanceNoticeResponse getNoticeById(Long id) {
        MaintenanceNotice notice = maintenanceNoticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MaintenanceNotice", "id", id));
        return MaintenanceNoticeResponse.fromEntity(notice);
    }

    @Transactional(readOnly = true)
    public List<IssueReportResponse> getIssueReports(IssueCategory category, IssueStatus status, Long buildingId) {
        return issueReportRepository.searchReports(category, status, buildingId).stream()
                .map(IssueReportResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IssueReportResponse getIssueById(Long id) {
        IssueReport report = issueReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("IssueReport", "id", id));
        return IssueReportResponse.fromEntity(report);
    }

    @Transactional
    public IssueReportResponse submitReport(IssueReportRequest request, User currentUser) {
        Building building = null;
        if (request.getBuildingId() != null) {
            building = buildingRepository.findById(request.getBuildingId()).orElse(null);
        }

        Floor floor = null;
        if (request.getFloorId() != null) {
            floor = floorRepository.findById(request.getFloorId()).orElse(null);
        }

        Room room = null;
        if (request.getRoomId() != null) {
            room = roomRepository.findById(request.getRoomId()).orElse(null);
        }

        IssueReport report = IssueReport.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority() != null ? request.getPriority() : IssuePriority.MEDIUM)
                .status(IssueStatus.REPORTED)
                .building(building)
                .floor(floor)
                .room(room)
                .specificLocation(request.getSpecificLocation())
                .reportedBy(currentUser)
                .upvoteCount(1)
                .build();

        IssueReport saved = issueReportRepository.save(report);
        log.info("New issue report submitted: [{}] {} in {}", saved.getCategory(), saved.getTitle(),
                building != null ? building.getName() : "Campus");
        return IssueReportResponse.fromEntity(saved);
    }

    @Transactional
    public IssueReportResponse upvoteIssue(Long id) {
        IssueReport report = issueReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("IssueReport", "id", id));
        report.setUpvoteCount(report.getUpvoteCount() + 1);
        IssueReport saved = issueReportRepository.save(report);
        log.info("Issue #{} upvoted. New count: {}", saved.getId(), saved.getUpvoteCount());
        return IssueReportResponse.fromEntity(saved);
    }

    @Transactional
    public IssueReportResponse updateIssueStatus(Long id, IssueStatus status, String staffNotes) {
        IssueReport report = issueReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("IssueReport", "id", id));

        report.setStatus(status);
        if (staffNotes != null && !staffNotes.isBlank()) {
            report.setStaffNotes(staffNotes);
        }
        if (status == IssueStatus.RESOLVED) {
            report.setResolvedAt(LocalDateTime.now());
        }

        IssueReport saved = issueReportRepository.save(report);
        log.info("Issue #{} updated to status: {}", saved.getId(), saved.getStatus());
        return IssueReportResponse.fromEntity(saved);
    }
}
