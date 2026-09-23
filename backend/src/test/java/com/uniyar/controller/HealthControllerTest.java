package com.uniyar.controller;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.uniyar.repository.UserRepository;
import com.uniyar.security.JwtAuthenticationFilter;
import com.uniyar.security.JwtTokenProvider;

@SpringBootTest
@MockBean({UserRepository.class, UserDetailsService.class, JwtTokenProvider.class, JwtAuthenticationFilter.class})
class HealthControllerTest {

    @Test
    void contextLoads() {
        // Verify Spring context loads successfully with security configuration
    }
}
