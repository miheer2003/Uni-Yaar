package com.uniyar.dto.admin;

import com.uniyar.entity.UserRole;
import com.uniyar.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String fullName;
    private String email;
    private UserRole role;
    private Long universityId;
    private String universityName;
    private LocalDateTime createdAt;

    public static AdminUserResponse fromEntity(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .universityName("Apex Institute of Technology")
                .createdAt(user.getCreatedAt())
                .build();
    }
}
