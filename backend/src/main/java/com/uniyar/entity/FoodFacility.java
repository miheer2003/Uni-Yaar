package com.uniyar.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "food_facilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodFacility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private FoodType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id")
    private Floor floor;

    @Column(nullable = false, length = 20)
    private String openingTime; // "07:30 AM"

    @Column(nullable = false, length = 20)
    private String closingTime; // "10:00 PM"

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "OPEN"; // OPEN, CLOSED

    @Column(columnDefinition = "TEXT")
    private String description;
}
