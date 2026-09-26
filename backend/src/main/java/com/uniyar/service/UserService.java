package com.uniyar.service;

import com.uniyar.dto.auth.AuthRequest;
import com.uniyar.entity.User;
import com.uniyar.entity.UserRole;
import com.uniyar.exception.ResourceNotFoundException;
import com.uniyar.repository.UserRepository;
import com.uniyar.repository.DepartmentRepository;
import com.uniyar.repository.FacultyRepository;
import com.uniyar.entity.Faculty;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;

    public User register(AuthRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole() != null ? request.getRole() : UserRole.ROLE_STUDENT)
                .build();

        User saved = userRepository.save(user);
        // A faculty account must have a profile immediately; otherwise it can never
        // appear in Faculty Finder or manage its own information.
        if (saved.getRole() == UserRole.ROLE_FACULTY) {
            departmentRepository.findAll().stream().findFirst().ifPresent(department ->
                    facultyRepository.save(Faculty.builder()
                            .user(saved)
                            .department(department)
                            .designation("Faculty Member")
                            .subjects("")
                            .build()));
        }
        return saved;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
}
