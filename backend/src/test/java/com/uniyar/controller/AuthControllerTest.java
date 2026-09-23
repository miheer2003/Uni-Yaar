package com.uniyar.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uniyar.dto.auth.AuthRequest;
import com.uniyar.entity.UserRole;
import com.uniyar.entity.User;
import com.uniyar.repository.UserRepository;
import com.uniyar.security.JwtTokenProvider;
import com.uniyar.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for unit testing the controller
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserRepository userRepository;

    private AuthRequest authRequest;
    private User mockUser;

    @BeforeEach
    void setUp() {
        authRequest = new AuthRequest();
        authRequest.setFullName("Test User");
        authRequest.setEmail("test@university.edu");
        authRequest.setPassword("password123");
        authRequest.setRole(UserRole.ROLE_STUDENT);

        mockUser = User.builder()
                .id(1L)
                .fullName("Test User")
                .email("test@university.edu")
                .role(UserRole.ROLE_STUDENT)
                .build();
    }

    @Test
    void register_Success() throws Exception {
        when(userService.register(any(AuthRequest.class))).thenReturn(mockUser);
        when(jwtTokenProvider.generateToken(any(User.class))).thenReturn("mockJwtToken");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.data.token").value("mockJwtToken"))
                .andExpect(jsonPath("$.data.email").value("test@university.edu"))
                .andExpect(jsonPath("$.data.role").value("ROLE_STUDENT"));
    }

    @Test
    void register_DuplicateEmail_ReturnsBadRequest() throws Exception {
        when(userService.register(any(AuthRequest.class)))
                .thenThrow(new IllegalArgumentException("Email already registered"));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email already registered"));
    }

    @Test
    void login_Success() throws Exception {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
                
        when(jwtTokenProvider.generateToken(any(User.class))).thenReturn("mockJwtToken");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.token").value("mockJwtToken"));
    }

    @Test
    void login_InvalidCredentials_ReturnsUnauthorized() throws Exception {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }
}
