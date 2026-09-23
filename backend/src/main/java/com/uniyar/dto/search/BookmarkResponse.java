package com.uniyar.dto.search;

import com.uniyar.entity.Bookmark;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkResponse {
    private Long id;
    private SearchItemType itemType;
    private Long itemId;
    private String title;
    private String subtitle;
    private String targetUrl;
    private LocalDateTime createdAt;

    public static BookmarkResponse fromEntity(Bookmark b) {
        return BookmarkResponse.builder()
                .id(b.getId())
                .itemType(b.getItemType())
                .itemId(b.getItemId())
                .title(b.getTitle())
                .subtitle(b.getSubtitle())
                .targetUrl(b.getTargetUrl())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
