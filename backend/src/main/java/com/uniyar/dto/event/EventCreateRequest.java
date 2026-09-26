package com.uniyar.dto.event;

import com.uniyar.entity.EventCategory;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventCreateRequest {
    @NotBlank @Size(max = 150) private String title;
    @Size(max = 5000) private String description;
    @NotNull private EventCategory category;
    @NotNull @Future private LocalDateTime startsAt;
    @NotNull @Future private LocalDateTime endsAt;
    @Size(max = 150) private String locationName;
    @Size(max = 255) private String registrationUrl;
    private Integer capacity;
    private Long roomId;
}
