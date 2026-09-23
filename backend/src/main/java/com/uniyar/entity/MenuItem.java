package com.uniyar.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MealType mealType;

    @Column(nullable = false, length = 150)
    private String itemName;

    @Column(length = 30)
    @Builder.Default
    private String dietaryTag = "VEG"; // VEG, NON_VEG, JAIN, EGG, SPECIAL

    private Double price;

    @Column(length = 255)
    private String description;
}
