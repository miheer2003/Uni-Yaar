package com.uniyar.dto.facility;

import com.uniyar.entity.IssueCategory;
import com.uniyar.entity.IssuePriority;
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
public class IssueReportRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private IssueCategory category;

    @Builder.Default
    private IssuePriority priority = IssuePriority.MEDIUM;

    private Long buildingId;
    private Long floorId;
    private Long roomId;
    private String specificLocation;
}
