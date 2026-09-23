package com.uniyar.repository;

import com.uniyar.entity.Announcement;
import com.uniyar.entity.AnnouncementAudience;
import com.uniyar.entity.AnnouncementCategory;
import com.uniyar.entity.AnnouncementPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByPriorityAndExpiresAtAfterOrExpiresAtIsNullOrderByCreatedAtDesc(
            AnnouncementPriority priority, LocalDateTime now
    );

    @Query("SELECT a FROM Announcement a WHERE " +
           "(:priority IS NULL OR a.priority = :priority) AND " +
           "(:category IS NULL OR a.category = :category) AND " +
           "(:audience IS NULL OR a.targetAudience = :audience OR a.targetAudience = com.uniyar.entity.AnnouncementAudience.ALL) AND " +
           "(:departmentId IS NULL OR a.department IS NULL OR a.department.id = :departmentId) AND " +
           "(a.expiresAt IS NULL OR a.expiresAt >= :now) " +
           "ORDER BY a.isPinned DESC, a.createdAt DESC")
    List<Announcement> searchAnnouncements(
            @Param("priority") AnnouncementPriority priority,
            @Param("category") AnnouncementCategory category,
            @Param("audience") AnnouncementAudience audience,
            @Param("departmentId") Long departmentId,
            @Param("now") LocalDateTime now
    );

    List<Announcement> findByIsPinnedTrueOrderByCreatedAtDesc();
}
