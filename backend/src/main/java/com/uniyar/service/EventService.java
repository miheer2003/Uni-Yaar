package com.uniyar.service;

import com.uniyar.dto.event.EventResponse;
import com.uniyar.entity.Event;
import com.uniyar.entity.EventCategory;
import com.uniyar.entity.EventStatus;
import com.uniyar.exception.ResourceNotFoundException;
import com.uniyar.repository.EventRepository;
import com.uniyar.repository.EventRegistrationRepository;
import com.uniyar.repository.RoomRepository;
import com.uniyar.dto.event.EventCreateRequest;
import com.uniyar.entity.User;
import com.uniyar.entity.EventRegistration;
import com.uniyar.entity.Room;
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
    private final EventRegistrationRepository eventRegistrationRepository;
    private final RoomRepository roomRepository;

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
    public EventResponse registerForEvent(Long id, User user) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));

        if (eventRegistrationRepository.findByEventIdAndUserId(id, user.getId()).isPresent()) {
            throw new IllegalStateException("You are already registered for this event");
        }
        if (event.getCapacity() != null && event.getRegisteredCount() >= event.getCapacity()) {
            throw new IllegalStateException("Event has reached full capacity (" + event.getCapacity() + " attendees)");
        }

        eventRegistrationRepository.save(EventRegistration.builder().event(event).user(user).build());
        event.setRegisteredCount((event.getRegisteredCount() == null ? 0 : event.getRegisteredCount()) + 1);
        Event saved = eventRepository.save(event);
        log.info("Registered attendee for event: {} (Current count: {})", saved.getTitle(), saved.getRegisteredCount());
        return EventResponse.fromEntity(saved);
    }

    @Transactional
    public EventResponse deregisterFromEvent(Long id, User user) {
        EventRegistration registration = eventRegistrationRepository.findByEventIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("You are not registered for this event"));
        Event event = registration.getEvent();
        eventRegistrationRepository.delete(registration);
        event.setRegisteredCount(Math.max(0, (event.getRegisteredCount() == null ? 0 : event.getRegisteredCount()) - 1));
        return EventResponse.fromEntity(eventRepository.save(event));
    }

    @Transactional
    public EventResponse createEvent(EventCreateRequest request, User organizer) {
        if (!request.getEndsAt().isAfter(request.getStartsAt())) throw new IllegalArgumentException("Event end time must be after its start time");
        Room room = request.getRoomId() == null ? null : roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));
        Event saved = eventRepository.save(Event.builder().title(request.getTitle()).description(request.getDescription())
                .category(request.getCategory()).status(EventStatus.UPCOMING).organizer(organizer.getFullName())
                .registrationUrl(request.getRegistrationUrl()).capacity(request.getCapacity()).registeredCount(0)
                .startsAt(request.getStartsAt()).endsAt(request.getEndsAt()).room(room)
                .locationName(request.getLocationName()).contactEmail(organizer.getEmail()).build());
        return EventResponse.fromEntity(saved);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventCreateRequest request, User editor) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        if (editor.getRole() != com.uniyar.entity.UserRole.ROLE_ADMIN && !editor.getFullName().equals(event.getOrganizer())) {
            throw new org.springframework.security.access.AccessDeniedException("Only the organizer or an admin can edit this event.");
        }
        if (!request.getEndsAt().isAfter(request.getStartsAt())) throw new IllegalArgumentException("Event end time must be after its start time");
        Room room = request.getRoomId() == null ? event.getRoom() : roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", request.getRoomId()));
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setStartsAt(request.getStartsAt());
        event.setEndsAt(request.getEndsAt());
        event.setRoom(room);
        event.setLocationName(request.getLocationName());
        event.setRegistrationUrl(request.getRegistrationUrl());
        if (request.getCapacity() != null) event.setCapacity(request.getCapacity());
        log.info("Event '{}' updated by {}", event.getTitle(), editor.getFullName());
        return EventResponse.fromEntity(eventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        eventRegistrationRepository.deleteAllByEventId(id);
        eventRepository.delete(event);
        log.info("Event '{}' (id={}) deleted by admin", event.getTitle(), id);
    }
}
