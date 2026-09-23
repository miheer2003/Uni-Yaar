package com.uniyar.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "announcements", indexes = {
    @Index(name = "idx_announcement_priority", columnList = "priority"),
    @Index(name = "idx_announcement_category", columnList = "category"),
    @Index(name = "idx_announcement_is_pinned", columnList = "isPinned")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AnnouncementPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AnnouncementCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private AnnouncementAudience targetAudience = AnnouncementAudience.ALL;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @Column(length = 255)
    private String attachmentUrl;

    @Column(length = 255)
    private String externalLink;

    @Builder.Default
    private Boolean isPinned = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;
}
