package com.uniyar.service;

import com.uniyar.dto.search.SearchItemType;
import com.uniyar.dto.search.SearchResponse;
import com.uniyar.dto.search.SearchResultItem;
import com.uniyar.entity.*;
import com.uniyar.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    private final BuildingRepository buildingRepository;
    private final RoomRepository roomRepository;
    private final FacultyRepository facultyRepository;
    private final FoodFacilityRepository foodFacilityRepository;
    private final EventRepository eventRepository;
    private final AnnouncementRepository announcementRepository;
    private final MaintenanceNoticeRepository maintenanceNoticeRepository;

    @Transactional(readOnly = true)
    public SearchResponse search(String query) {
        if (query == null || query.trim().length() < 2) {
            return SearchResponse.builder().query(query).totalResults(0).results(List.of()).build();
        }

        String q = query.trim();
        List<SearchResultItem> results = new ArrayList<>();

        // 1. Buildings
        try {
            var buildingsPage = buildingRepository.findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(
                    q, q, PageRequest.of(0, 5)
            );
            for (Building b : buildingsPage.getContent()) {
                results.add(SearchResultItem.builder()
                        .id(b.getId())
                        .type(SearchItemType.BUILDING)
                        .title(b.getName())
                        .subtitle("Code: " + b.getCode() + " • " + (b.getUniversity() != null ? b.getUniversity().getName() : "Campus"))
                        .details(b.getDescription())
                        .badge("BUILDING")
                        .targetUrl("/buildings/" + b.getId())
                        .buildingId(b.getId())
                        .latitude(b.getLatitude())
                        .longitude(b.getLongitude())
                        .build());
            }
        } catch (Exception e) {
            log.warn("Building search failed for '{}': {}", q, e.getMessage());
        }

        // 2. Rooms
        try {
            var rooms = roomRepository.findByNameContainingIgnoreCaseOrRoomNumberContainingIgnoreCase(q, q);
            int count = 0;
            for (Room r : rooms) {
                if (count++ >= 5) break;
                String bName = r.getFloor() != null && r.getFloor().getBuilding() != null
                        ? r.getFloor().getBuilding().getName() : "Campus";
                Long bId = r.getFloor() != null && r.getFloor().getBuilding() != null
                        ? r.getFloor().getBuilding().getId() : null;

                results.add(SearchResultItem.builder()
                        .id(r.getId())
                        .type(SearchItemType.ROOM)
                        .title("Room " + r.getRoomNumber() + " - " + r.getName())
                        .subtitle(bName + (r.getFloor() != null ? " • Floor " + r.getFloor().getFloorNumber() : ""))
                        .details("Type: " + r.getRoomType() + (r.getCapacity() != null ? " • Cap: " + r.getCapacity() : ""))
                        .badge("ROOM")
                        .targetUrl(bId != null ? "/buildings/" + bId : "/map")
                        .buildingId(bId)
                        .roomId(r.getId())
                        .build());
            }
        } catch (Exception e) {
            log.warn("Room search failed for '{}': {}", q, e.getMessage());
        }

        // 3. Faculty
        try {
            var facultyPage = facultyRepository.searchFaculty(q, null, PageRequest.of(0, 5));
            for (Faculty f : facultyPage.getContent()) {
                String name = f.getUser() != null ? f.getUser().getFullName() : "Faculty Member";
                String dept = f.getDepartment() != null ? f.getDepartment().getName() : "Academics";
                results.add(SearchResultItem.builder()
                        .id(f.getId())
                        .type(SearchItemType.FACULTY)
                        .title(name)
                        .subtitle(f.getDesignation() + " • " + dept)
                        .details(f.getSubjects())
                        .badge("FACULTY")
                        .targetUrl("/faculty/" + f.getId())
                        .build());
            }
        } catch (Exception e) {
            log.warn("Faculty search failed for '{}': {}", q, e.getMessage());
        }

        // 4. Food & Mess
        try {
            var outlets = foodFacilityRepository.findByNameContainingIgnoreCase(q);
            int count = 0;
            for (FoodFacility f : outlets) {
                if (count++ >= 4) break;
                results.add(SearchResultItem.builder()
                        .id(f.getId())
                        .type(SearchItemType.FOOD_OUTLET)
                        .title(f.getName())
                        .subtitle(f.getType() + " • " + (f.getBuilding() != null ? f.getBuilding().getName() : "Campus"))
                        .details(f.getOpeningTime() + " - " + f.getClosingTime() + " (" + f.getStatus() + ")")
                        .badge(f.getType().name())
                        .targetUrl("/food")
                        .buildingId(f.getBuilding() != null ? f.getBuilding().getId() : null)
                        .latitude(f.getBuilding() != null ? f.getBuilding().getLatitude() : null)
                        .longitude(f.getBuilding() != null ? f.getBuilding().getLongitude() : null)
                        .build());
            }
        } catch (Exception e) {
            log.warn("Food search failed for '{}': {}", q, e.getMessage());
        }

        // 5. Events & Hackathons
        try {
            var events = eventRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q);
            int count = 0;
            for (Event ev : events) {
                if (count++ >= 4) break;
                results.add(SearchResultItem.builder()
                        .id(ev.getId())
                        .type(SearchItemType.EVENT)
                        .title(ev.getTitle())
                        .subtitle(ev.getCategory() + " • Organized by " + ev.getOrganizer())
                        .details("Status: " + ev.getStatus() + (ev.getLocationName() != null ? " • " + ev.getLocationName() : ""))
                        .badge(ev.getCategory().name())
                        .targetUrl("/events")
                        .buildingId(ev.getRoom() != null && ev.getRoom().getFloor() != null && ev.getRoom().getFloor().getBuilding() != null
                                ? ev.getRoom().getFloor().getBuilding().getId() : null)
                        .build());
            }
        } catch (Exception e) {
            log.warn("Event search failed for '{}': {}", q, e.getMessage());
        }

        // 6. Announcements
        try {
            var notices = announcementRepository.searchAnnouncements(null, null, null, null, null);
            int count = 0;
            for (Announcement a : notices) {
                if (a.getTitle().toLowerCase().contains(q.toLowerCase()) || a.getContent().toLowerCase().contains(q.toLowerCase())) {
                    if (count++ >= 3) break;
                    results.add(SearchResultItem.builder()
                            .id(a.getId())
                            .type(SearchItemType.ANNOUNCEMENT)
                            .title(a.getTitle())
                            .subtitle(a.getPriority() + " Notice • " + a.getCategory())
                            .details(a.getAuthor() != null ? a.getAuthor().getFullName() : "Admin Office")
                            .badge(a.getPriority().name())
                            .targetUrl("/announcements")
                            .build());
                }
            }
        } catch (Exception e) {
            log.warn("Announcement search failed for '{}': {}", q, e.getMessage());
        }

        // 7. Active Maintenance
        try {
            var notices = maintenanceNoticeRepository.findByIsActiveTrueOrderByCreatedAtDesc();
            int count = 0;
            for (MaintenanceNotice m : notices) {
                if (m.getTitle().toLowerCase().contains(q.toLowerCase()) ||
                    (m.getAffectedAsset() != null && m.getAffectedAsset().toLowerCase().contains(q.toLowerCase()))) {
                    if (count++ >= 3) break;
                    results.add(SearchResultItem.builder()
                            .id(m.getId())
                            .type(SearchItemType.MAINTENANCE)
                            .title(m.getTitle())
                            .subtitle("Status: " + m.getStatus() + (m.getAffectedAsset() != null ? " • " + m.getAffectedAsset() : ""))
                            .details(m.getAlternativeSuggestion() != null ? "Alt: " + m.getAlternativeSuggestion() : "")
                            .badge("MAINTENANCE")
                            .targetUrl("/facilities")
                            .buildingId(m.getBuilding() != null ? m.getBuilding().getId() : null)
                            .build());
                }
            }
        } catch (Exception e) {
            log.warn("Maintenance search failed for '{}': {}", q, e.getMessage());
        }

        return SearchResponse.builder()
                .query(q)
                .totalResults(results.size())
                .results(results)
                .build();
    }
}
