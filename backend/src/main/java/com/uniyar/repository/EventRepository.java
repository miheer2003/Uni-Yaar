package com.uniyar.repository;

import com.uniyar.entity.Event;
import com.uniyar.entity.EventCategory;
import com.uniyar.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByCategory(EventCategory category);

    List<Event> findByStatus(EventStatus status);

    List<Event> findByIsFeaturedTrueOrderByStartsAtAsc();

    @Query("SELECT e FROM Event e WHERE " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:fromTime IS NULL OR e.endsAt >= :fromTime) " +
           "ORDER BY e.startsAt ASC")
    List<Event> searchEvents(
            @Param("category") EventCategory category,
            @Param("status") EventStatus status,
            @Param("fromTime") LocalDateTime fromTime
    );

    List<Event> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
}
