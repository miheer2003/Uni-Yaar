package com.uniyar.dto.event;

import com.uniyar.entity.Event;
import com.uniyar.entity.EventCategory;
import com.uniyar.entity.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private EventCategory category;
    private EventStatus status;
    private String bannerUrl;
    private String organizer;
    private String registrationUrl;
    private Integer capacity;
    private Integer registeredCount;
    private LocalDateTime startsAt;
    private LocalDateTime endsAt;
    private Long roomId;
    private String roomNumber;
    private String roomName;
    private Long buildingId;
    private String buildingName;
    private String buildingCode;
    private Double latitude;
    private Double longitude;
    private String locationName;
    private String contactEmail;
    private Boolean isFeatured;

    public static EventResponse fromEntity(Event event) {
        EventResponseBuilder builder = EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .category(event.getCategory())
                .status(event.getStatus())
                .bannerUrl(event.getBannerUrl())
                .organizer(event.getOrganizer())
                .registrationUrl(event.getRegistrationUrl())
                .capacity(event.getCapacity())
                .registeredCount(event.getRegisteredCount())
                .startsAt(event.getStartsAt())
                .endsAt(event.getEndsAt())
                .locationName(event.getLocationName())
                .contactEmail(event.getContactEmail())
                .isFeatured(event.getIsFeatured());

        if (event.getRoom() != null) {
            builder.roomId(event.getRoom().getId())
                   .roomNumber(event.getRoom().getRoomNumber())
                   .roomName(event.getRoom().getName());

            if (event.getRoom().getFloor() != null && event.getRoom().getFloor().getBuilding() != null) {
                var building = event.getRoom().getFloor().getBuilding();
                builder.buildingId(building.getId())
                       .buildingName(building.getName())
                       .buildingCode(building.getCode())
                       .latitude(building.getLatitude())
                       .longitude(building.getLongitude());
            }
        }

        return builder.build();
    }
}
