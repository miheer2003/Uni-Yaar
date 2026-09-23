package com.uniyar.service;

import com.uniyar.dto.auth.AuthRequest;
import com.uniyar.entity.UserRole;
import com.uniyar.entity.User;
import com.uniyar.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.mockito.ArgumentCaptor;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private AuthRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new AuthRequest();
        validRequest.setFullName("Test User");
        validRequest.setEmail("test@university.edu");
        validRequest.setPassword("password123");
        validRequest.setRole(UserRole.ROLE_STUDENT);
    }

    @Test
    void register_Success() {
        // Arrange
        when(userRepository.findByEmail(validRequest.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(validRequest.getPassword())).thenReturn("encodedPassword");
        
        User savedUser = User.builder()
                .id(1L)
                .fullName(validRequest.getFullName())
                .email(validRequest.getEmail())
                .password("encodedPassword")
                .role(UserRole.ROLE_STUDENT)
                .build();
                
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        User result = userService.register(validRequest);

        // Assert
        assertNotNull(result);
        assertEquals(validRequest.getEmail(), result.getEmail());
        assertEquals(UserRole.ROLE_STUDENT, result.getRole());
        
        verify(userRepository).findByEmail(validRequest.getEmail());
        verify(passwordEncoder).encode(validRequest.getPassword());
        
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User capturedUser = userCaptor.getValue();
        assertEquals("encodedPassword", capturedUser.getPassword());
        assertEquals(validRequest.getEmail(), capturedUser.getEmail());
    }

    @Test
    void register_ThrowsException_WhenEmailExists() {
        // Arrange
        when(userRepository.findByEmail(validRequest.getEmail()))
                .thenReturn(Optional.of(new User()));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.register(validRequest);
        });
        
        assertEquals("Email already registered", exception.getMessage());
        
        verify(userRepository).findByEmail(validRequest.getEmail());
        verify(userRepository, never()).save(any(User.class));
    }
}
