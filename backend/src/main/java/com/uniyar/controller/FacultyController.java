package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.faculty.FacultyResponse;
import com.uniyar.dto.faculty.TimetableResponse;
import com.uniyar.dto.faculty.FacultyProfileUpdateRequest;
import com.uniyar.dto.faculty.TimetableUpdateRequest;
import com.uniyar.entity.User;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import com.uniyar.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<FacultyResponse>>> getFaculty(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<FacultyResponse> page = facultyService.getFacultyList(search, departmentId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FacultyResponse>> getFacultyById(@PathVariable Long id) {
        FacultyResponse faculty = facultyService.getFacultyById(id);
        return ResponseEntity.ok(ApiResponse.success(faculty));
    }

    @GetMapping("/{id}/timetable")
    public ResponseEntity<ApiResponse<List<TimetableResponse>>> getFacultyTimetable(@PathVariable Long id) {
        List<TimetableResponse> timetable = facultyService.getFacultyTimetable(id);
        return ResponseEntity.ok(ApiResponse.success(timetable));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<FacultyResponse>> getMyProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(facultyService.getFacultyByUserId(user.getId())));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<FacultyResponse>> updateMyProfile(@Valid @RequestBody FacultyProfileUpdateRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(facultyService.updateMyProfile(user.getId(), request), "Faculty profile updated"));
    }

    @GetMapping("/me/timetable")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<List<TimetableResponse>>> getMyTimetable(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        FacultyResponse profile = facultyService.getFacultyByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(facultyService.getFacultyTimetable(profile.getId())));
    }

    @PostMapping("/me/timetable")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<TimetableResponse>> createMyTimetable(@Valid @RequestBody TimetableUpdateRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(facultyService.createMyTimetable(user.getId(), request), "Timetable entry created"));
    }

    @DeleteMapping("/me/timetable/{id}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<Void>> deleteMyTimetable(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        facultyService.deleteMyTimetable(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(null, "Timetable entry removed"));
    }

    @PostMapping("/timetable")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public ResponseEntity<ApiResponse<TimetableResponse>> createTimetable(@Valid @RequestBody TimetableUpdateRequest request, Authentication authentication) {
        User caller = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(facultyService.createTimetable(request, caller), "Timetable entry created"));
    }

    @PutMapping("/timetable/{id}")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public ResponseEntity<ApiResponse<TimetableResponse>> updateTimetable(@PathVariable Long id, @Valid @RequestBody TimetableUpdateRequest request, Authentication authentication) {
        User caller = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(facultyService.updateTimetable(id, request, caller), "Timetable entry updated"));
    }

    @DeleteMapping("/timetable/{id}")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTimetable(@PathVariable Long id, Authentication authentication) {
        User caller = (User) authentication.getPrincipal();
        facultyService.deleteTimetable(id, caller);
        return ResponseEntity.ok(ApiResponse.success(null, "Timetable entry deleted"));
    }
}
