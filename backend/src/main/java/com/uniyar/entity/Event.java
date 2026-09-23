package com.uniyar.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events", indexes = {
    @Index(name = "idx_event_category", columnList = "category"),
    @Index(name = "idx_event_status", columnList = "status"),
    @Index(name = "idx_event_starts_at", columnList = "startsAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EventCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EventStatus status;

    @Column(length = 255)
    private String bannerUrl;

    @Column(length = 100)
    private String organizer;

    @Column(length = 255)
    private String registrationUrl;

    private Integer capacity;

    @Builder.Default
    private Integer registeredCount = 0;

    @Column(nullable = false)
    private LocalDateTime startsAt;

    @Column(nullable = false)
    private LocalDateTime endsAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(length = 150)
    private String locationName;

    @Column(length = 100)
    private String contactEmail;

    @Builder.Default
    private Boolean isFeatured = false;
}
