package com.uniyar.dto.campus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildingRequest {

    private Long universityId;

    @NotBlank(message = "Building name is required")
    @Size(max = 150)
    private String name;

    @NotBlank(message = "Building code is required")
    @Size(max = 30)
    private String code;

    private String description;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String address;

    private Integer totalFloors;
}
