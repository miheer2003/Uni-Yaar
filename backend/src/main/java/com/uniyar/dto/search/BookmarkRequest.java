package com.uniyar.dto.search;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkRequest {

    @NotNull(message = "Item type is required")
    private SearchItemType itemType;

    @NotNull(message = "Item id is required")
    private Long itemId;

    @NotBlank(message = "Title is required")
    private String title;

    private String subtitle;

    @NotBlank(message = "Target URL is required")
    private String targetUrl;
}
