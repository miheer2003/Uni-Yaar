package com.uniyar.service;

import com.uniyar.dto.faculty.FacultyResponse;
import com.uniyar.dto.faculty.TimetableResponse;
import com.uniyar.entity.*;
import com.uniyar.exception.ResourceNotFoundException;
import com.uniyar.repository.FacultyRepository;
import com.uniyar.repository.TimetableRepository;
import com.uniyar.repository.RoomRepository;
import com.uniyar.dto.faculty.FacultyProfileUpdateRequest;
import com.uniyar.dto.faculty.TimetableUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final TimetableRepository timetableRepository;
    private final RoomRepository roomRepository;

    public Page<FacultyResponse> getFacultyList(String search, Long departmentId, Pageable pageable) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        Page<Faculty> page = facultyRepository.searchFaculty(cleanSearch, departmentId, pageable);
        return page.map(this::mapToFacultyResponse);
    }

    public FacultyResponse getFacultyById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));
        return mapToFacultyResponse(faculty);
    }

    public List<TimetableResponse> getFacultyTimetable(Long facultyId) {
        if (!facultyRepository.existsById(facultyId)) {
            throw new ResourceNotFoundException("Faculty not found with id: " + facultyId);
        }
        return timetableRepository.findByFacultyId(facultyId).stream()
                .map(this::mapToTimetableResponse)
                .collect(Collectors.toList());
    }

    public FacultyResponse getFacultyByUserId(Long userId) {
        return mapToFacultyResponse(facultyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty profile not found for this account")));
    }

    @Transactional
    public FacultyResponse updateMyProfile(Long userId, FacultyProfileUpdateRequest request) {
        Faculty faculty = facultyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty profile not found for this account"));
        faculty.setDesignation(request.getDesignation());
        faculty.setSubjects(request.getSubjects());
        faculty.setAvatarUrl(request.getAvatarUrl());
        faculty.setBio(request.getBio());
        return mapToFacultyResponse(facultyRepository.save(faculty));
    }

    @Transactional
    public TimetableResponse createTimetable(TimetableUpdateRequest request, User caller) {
        if (request.getFacultyId() == null) throw new IllegalArgumentException("Faculty ID is required");
        Faculty faculty = facultyRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty", "id", request.getFacultyId()));
        if (caller.getRole() != UserRole.ROLE_ADMIN && !faculty.getUser().getId().equals(caller.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can only create timetable entries for your own faculty profile.");
        }
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));
        Timetable entry = Timetable.builder().faculty(faculty).room(room).subject(request.getSubject())
                .dayOfWeek(request.getDayOfWeek().toUpperCase()).startTime(request.getStartTime())
                .endTime(request.getEndTime()).build();
        return mapToTimetableResponse(timetableRepository.save(entry));
    }

    @Transactional
    public TimetableResponse updateTimetable(Long id, TimetableUpdateRequest request, User caller) {
        Timetable entry = timetableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable", "id", id));
        if (caller.getRole() != UserRole.ROLE_ADMIN && !entry.getFaculty().getUser().getId().equals(caller.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can only update your own timetable entries.");
        }
        Faculty faculty = facultyRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty", "id", request.getFacultyId()));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));
        entry.setFaculty(faculty); entry.setRoom(room); entry.setSubject(request.getSubject());
        entry.setDayOfWeek(request.getDayOfWeek().toUpperCase()); entry.setStartTime(request.getStartTime()); entry.setEndTime(request.getEndTime());
        return mapToTimetableResponse(timetableRepository.save(entry));
    }

    @Transactional
    public void deleteTimetable(Long id, User caller) {
        Timetable entry = timetableRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Timetable", "id", id));
        if (caller.getRole() != UserRole.ROLE_ADMIN && !entry.getFaculty().getUser().getId().equals(caller.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can only delete your own timetable entries.");
        }
        timetableRepository.deleteById(id);
    }

    @Transactional
    public TimetableResponse createMyTimetable(Long userId, TimetableUpdateRequest request) {
        Faculty faculty = facultyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty profile not found for this account"));
        request.setFacultyId(faculty.getId());
        return createTimetable(request, faculty.getUser());
    }

    @Transactional
    public void deleteMyTimetable(Long userId, Long id) {
        Timetable entry = timetableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable", "id", id));
        if (!entry.getFaculty().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only remove your own timetable entries");
        }
        timetableRepository.delete(entry);
    }

    private FacultyResponse mapToFacultyResponse(Faculty f) {
        User u = f.getUser();
        Department d = f.getDepartment();
        Room office = f.getOfficeRoom();
        Building bldg = (office != null && office.getFloor() != null) ? office.getFloor().getBuilding() : null;

        return FacultyResponse.builder()
                .id(f.getId())
                .userId(u != null ? u.getId() : null)
                .fullName(u != null ? u.getFullName() : "Faculty Member")
                .email(u != null ? u.getEmail() : "")
                .departmentId(d != null ? d.getId() : null)
                .departmentName(d != null ? d.getName() : "General")
                .designation(f.getDesignation())
                .subjects(f.getSubjects())
                .officeRoomId(office != null ? office.getId() : null)
                .officeRoomNumber(office != null ? office.getRoomNumber() : null)
                .officeBuildingName(bldg != null ? bldg.getName() : null)
                .officeBuildingCode(bldg != null ? bldg.getCode() : null)
                .officeLatitude(bldg != null ? bldg.getLatitude() : null)
                .officeLongitude(bldg != null ? bldg.getLongitude() : null)
                .avatarUrl(f.getAvatarUrl())
                .bio(f.getBio())
                .build();
    }

    private TimetableResponse mapToTimetableResponse(Timetable t) {
        Room r = t.getRoom();
        Building b = (r != null && r.getFloor() != null) ? r.getFloor().getBuilding() : null;

        return TimetableResponse.builder()
                .id(t.getId())
                .facultyId(t.getFaculty().getId())
                .facultyName(t.getFaculty().getUser() != null ? t.getFaculty().getUser().getFullName() : "")
                .roomId(r != null ? r.getId() : null)
                .roomNumber(r != null ? r.getRoomNumber() : "")
                .roomName(r != null ? r.getName() : "")
                .buildingName(b != null ? b.getName() : "")
                .buildingCode(b != null ? b.getCode() : "")
                .latitude(b != null ? b.getLatitude() : null)
                .longitude(b != null ? b.getLongitude() : null)
                .subject(t.getSubject())
                .dayOfWeek(t.getDayOfWeek())
                .startTime(t.getStartTime())
                .endTime(t.getEndTime())
                .indicator("Scheduled Location")
                .build();
    }
}
