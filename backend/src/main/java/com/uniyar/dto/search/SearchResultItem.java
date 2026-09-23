package com.uniyar.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultItem {
    private Long id;
    private SearchItemType type;
    private String title;
    private String subtitle;
    private String details;
    private String badge;
    private String targetUrl;
    private Long buildingId;
    private Long roomId;
    private Double latitude;
    private Double longitude;
}
