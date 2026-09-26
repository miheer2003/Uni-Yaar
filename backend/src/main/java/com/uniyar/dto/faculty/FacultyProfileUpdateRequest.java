package com.uniyar.dto.faculty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FacultyProfileUpdateRequest {
    @NotBlank @Size(max = 100)
    private String designation;
    @Size(max = 255)
    private String subjects;
    @Size(max = 500)
    private String avatarUrl;
    @Size(max = 5000)
    private String bio;
}
