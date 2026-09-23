package com.uniyar.repository;

import com.uniyar.entity.FoodFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodFacilityRepository extends JpaRepository<FoodFacility, Long> {
    List<FoodFacility> findByBuildingId(Long buildingId);
    List<FoodFacility> findByNameContainingIgnoreCase(String name);
}
