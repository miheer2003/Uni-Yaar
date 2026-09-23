package com.uniyar.dto.faculty;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetableResponse {
    private Long id;
    private Long facultyId;
    private String facultyName;
    private Long roomId;
    private String roomNumber;
    private String roomName;
    private String buildingName;
    private String buildingCode;
    private Double latitude;
    private Double longitude;
    private String subject;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private String indicator; // Always "Scheduled Location"
}
