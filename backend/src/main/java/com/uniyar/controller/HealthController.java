package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<HealthInfo>> healthCheck() {
        HealthInfo healthInfo = new HealthInfo(
                "UniYaar",
                "UP",
                "1.0.0",
                LocalDateTime.now()
        );
        
        ApiResponse<HealthInfo> response = ApiResponse.success(
                healthInfo,
                HttpStatus.OK,
                "Application is running successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/")
    public ResponseEntity<ApiResponse<String>> root() {
        ApiResponse<String> response = ApiResponse.success(
                "Welcome to UniYaar API - Your Smart University Companion",
                HttpStatus.OK,
                "UniYaar Backend Service"
        );
        
        return ResponseEntity.ok(response);
    }
    
    @Data
    public static class HealthInfo {
        private final String application;
        private final String status;
        private final String version;
        private final LocalDateTime checkedAt;
        
        public HealthInfo(String application, String status, String version, LocalDateTime checkedAt) {
            this.application = application;
            this.status = status;
            this.version = version;
            this.checkedAt = checkedAt;
        }
    }
}
