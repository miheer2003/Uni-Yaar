package com.uniyar.service;

import com.uniyar.dto.announcement.AnnouncementResponse;
import com.uniyar.entity.*;
import com.uniyar.exception.ResourceNotFoundException;
import com.uniyar.repository.AnnouncementRepository;
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
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAnnouncements(
            AnnouncementPriority priority,
            AnnouncementCategory category,
            AnnouncementAudience audience,
            Long departmentId
    ) {
        LocalDateTime now = LocalDateTime.now();
        return announcementRepository.searchAnnouncements(priority, category, audience, departmentId, now).stream()
                .map(AnnouncementResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getUrgentAnnouncements() {
        LocalDateTime now = LocalDateTime.now();
        return announcementRepository.findByPriorityAndExpiresAtAfterOrExpiresAtIsNullOrderByCreatedAtDesc(
                AnnouncementPriority.URGENT, now
        ).stream()
                .map(AnnouncementResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnnouncementResponse getAnnouncementById(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));
        return AnnouncementResponse.fromEntity(announcement);
    }
}
