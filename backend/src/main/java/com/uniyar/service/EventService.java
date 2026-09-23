package com.uniyar.service;

import com.uniyar.dto.event.EventResponse;
import com.uniyar.entity.Event;
import com.uniyar.entity.EventCategory;
import com.uniyar.entity.EventStatus;
import com.uniyar.exception.ResourceNotFoundException;
import com.uniyar.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;

    @Transactional(readOnly = true)
    public List<EventResponse> getEvents(EventCategory category, EventStatus status, Boolean upcomingOnly) {
        LocalDateTime fromTime = Boolean.TRUE.equals(upcomingOnly) ? LocalDateTime.now() : null;
        return eventRepository.searchEvents(category, status, fromTime).stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        return EventResponse.fromEntity(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getFeaturedEvents() {
        return eventRepository.findByIsFeaturedTrueOrderByStartsAtAsc().stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventResponse registerForEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));

        if (event.getCapacity() != null && event.getRegisteredCount() >= event.getCapacity()) {
            throw new IllegalStateException("Event has reached full capacity (" + event.getCapacity() + " attendees)");
        }

        event.setRegisteredCount(event.getRegisteredCount() + 1);
        Event saved = eventRepository.save(event);
        log.info("Registered attendee for event: {} (Current count: {})", saved.getTitle(), saved.getRegisteredCount());
        return EventResponse.fromEntity(saved);
    }
}
