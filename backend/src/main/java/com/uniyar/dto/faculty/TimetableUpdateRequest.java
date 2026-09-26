package com.uniyar.dto.faculty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TimetableUpdateRequest {
    private Long facultyId;
    @NotNull private Long roomId;
    @NotBlank @Size(max = 150) private String subject;
    @NotBlank @Size(max = 20) private String dayOfWeek;
    @NotBlank @Size(max = 10) private String startTime;
    @NotBlank @Size(max = 10) private String endTime;
}
