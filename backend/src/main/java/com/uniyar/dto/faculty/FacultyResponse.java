package com.uniyar.dto.faculty;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacultyResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private Long departmentId;
    private String departmentName;
    private String designation;
    private String subjects;
    private Long officeRoomId;
    private String officeRoomNumber;
    private String officeBuildingName;
    private String officeBuildingCode;
    private Double officeLatitude;
    private Double officeLongitude;
    private String avatarUrl;
    private String bio;
}
