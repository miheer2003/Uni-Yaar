package com.uniyar.dto.announcement;

import com.uniyar.entity.Announcement;
import com.uniyar.entity.AnnouncementAudience;
import com.uniyar.entity.AnnouncementCategory;
import com.uniyar.entity.AnnouncementPriority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementResponse {
    private Long id;
    private String title;
    private String content;
    private AnnouncementPriority priority;
    private AnnouncementCategory category;
    private AnnouncementAudience targetAudience;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private String authorName;
    private String attachmentUrl;
    private String externalLink;
    private Boolean isPinned;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    public static AnnouncementResponse fromEntity(Announcement announcement) {
        AnnouncementResponseBuilder builder = AnnouncementResponse.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .priority(announcement.getPriority())
                .category(announcement.getCategory())
                .targetAudience(announcement.getTargetAudience())
                .attachmentUrl(announcement.getAttachmentUrl())
                .externalLink(announcement.getExternalLink())
                .isPinned(announcement.getIsPinned())
                .createdAt(announcement.getCreatedAt())
                .expiresAt(announcement.getExpiresAt());

        if (announcement.getDepartment() != null) {
            builder.departmentId(announcement.getDepartment().getId())
                   .departmentName(announcement.getDepartment().getName())
                   .departmentCode(announcement.getDepartment().getCode());
        }

        if (announcement.getAuthor() != null) {
            builder.authorName(announcement.getAuthor().getFullName());
        } else {
            builder.authorName("University Administration");
        }

        return builder.build();
    }
}
