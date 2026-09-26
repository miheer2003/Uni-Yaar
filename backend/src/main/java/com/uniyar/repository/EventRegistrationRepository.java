package com.uniyar.repository;

import com.uniyar.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    Optional<EventRegistration> findByEventIdAndUserId(Long eventId, Long userId);
    void deleteAllByEventId(Long eventId);
}
