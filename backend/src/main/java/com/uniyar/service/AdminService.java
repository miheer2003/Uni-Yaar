package com.uniyar.service;

import com.uniyar.dto.admin.AdminDashboardMetrics;
import com.uniyar.dto.admin.AdminUserResponse;
import com.uniyar.entity.IssueStatus;
import com.uniyar.entity.MaintenanceNotice;
import com.uniyar.entity.UserRole;
import com.uniyar.entity.User;
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
public class AdminService {

    private final BuildingRepository buildingRepository;
    private final RoomRepository roomRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final MaintenanceNoticeRepository maintenanceNoticeRepository;
    private final IssueReportRepository issueReportRepository;
    private final EventRepository eventRepository;
    private final FoodFacilityRepository foodFacilityRepository;
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public AdminDashboardMetrics getDashboardMetrics() {
        long totalBuildings = buildingRepository.count();
        long totalRooms = roomRepository.count();
        long totalFaculty = facultyRepository.count();
        long activeMaintenance = maintenanceNoticeRepository.findByIsActiveTrueOrderByCreatedAtDesc().size();
        long pendingIssues = issueReportRepository.findAll().stream()
                .filter(r -> r.getStatus() == IssueStatus.REPORTED || r.getStatus() == IssueStatus.IN_REVIEW)
                .count();
        long upcomingEvents = eventRepository.count();
        long activeOutlets = foodFacilityRepository.count();
        long totalAnnouncements = announcementRepository.count();
        long totalUsers = userRepository.count();

        return AdminDashboardMetrics.builder()
                .totalBuildings(totalBuildings)
                .totalRooms(totalRooms)
                .totalFaculty(totalFaculty)
                .activeMaintenanceCount(activeMaintenance)
                .pendingIssueReportsCount(pendingIssues)
                .upcomingEventsCount(upcomingEvents)
                .activeFoodOutletsCount(activeOutlets)
                .totalAnnouncementsCount(totalAnnouncements)
                .totalUsersCount(totalUsers)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(AdminUserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserResponse updateUserRole(Long userId, UserRole newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setRole(newRole);
        User saved = userRepository.save(user);

        if (newRole == UserRole.ROLE_FACULTY) {
            boolean hasProfile = facultyRepository.findByUserId(user.getId()).isPresent();
            if (!hasProfile) {
                com.uniyar.entity.Department dept = departmentRepository.findAll().stream().findFirst().orElse(null);
                if (dept != null) {
                    com.uniyar.entity.Faculty faculty = com.uniyar.entity.Faculty.builder()
                            .user(saved)
                            .department(dept)
                            .designation("New Faculty Member")
                            .subjects("To be assigned")
                            .bio("Faculty profile pending update.")
                            .build();
                    facultyRepository.save(faculty);
                    log.info("Created new empty faculty profile for user {}", saved.getEmail());
                }
            }
        }

        log.info("Updated role for user {} to {}", saved.getEmail(), saved.getRole());
        return AdminUserResponse.fromEntity(saved);
    }

    @Transactional
    public void resolveMaintenanceNotice(Long noticeId) {
        MaintenanceNotice notice = maintenanceNoticeRepository.findById(noticeId)
                .orElseThrow(() -> new ResourceNotFoundException("MaintenanceNotice", "id", noticeId));

        notice.setIsActive(false);
        notice.setResolvedAt(LocalDateTime.now());
        maintenanceNoticeRepository.save(notice);
        log.info("Maintenance notice #{} marked as resolved", noticeId);
    }
}
