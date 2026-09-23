package com.uniyar.entity;

import com.uniyar.dto.search.SearchItemType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookmarks", indexes = {
    @Index(name = "idx_bookmark_user", columnList = "user_id"),
    @Index(name = "idx_bookmark_item", columnList = "itemType, itemId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SearchItemType itemType;

    @Column(nullable = false)
    private Long itemId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 150)
    private String subtitle;

    @Column(nullable = false, length = 255)
    private String targetUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
