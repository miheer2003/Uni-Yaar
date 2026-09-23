package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.faculty.FacultyResponse;
import com.uniyar.dto.faculty.TimetableResponse;
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
}
