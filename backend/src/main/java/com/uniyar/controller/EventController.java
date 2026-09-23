package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.event.EventResponse;
import com.uniyar.entity.EventCategory;
import com.uniyar.entity.EventStatus;
import com.uniyar.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents(
            @RequestParam(required = false) EventCategory category,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(required = false, defaultValue = "false") Boolean upcoming
    ) {
        List<EventResponse> events = eventService.getEvents(category, status, upcoming);
        return ResponseEntity.ok(ApiResponse.success(events, "Events retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(@PathVariable Long id) {
        EventResponse event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success(event, "Event details retrieved successfully"));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getFeaturedEvents() {
        List<EventResponse> events = eventService.getFeaturedEvents();
        return ResponseEntity.ok(ApiResponse.success(events, "Featured events retrieved successfully"));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse<EventResponse>> registerForEvent(@PathVariable Long id) {
        EventResponse event = eventService.registerForEvent(id);
        return ResponseEntity.ok(ApiResponse.success(event, "Registration confirmed successfully!"));
    }
}
