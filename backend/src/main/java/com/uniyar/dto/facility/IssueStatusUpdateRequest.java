package com.uniyar.dto.facility;

import com.uniyar.entity.IssueStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private IssueStatus status;

    private String staffNotes;
}
