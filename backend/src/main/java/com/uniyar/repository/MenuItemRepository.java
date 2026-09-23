package com.uniyar.repository;

import com.uniyar.entity.MenuItem;
import com.uniyar.entity.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByMenuId(Long menuId);
    List<MenuItem> findByMenuIdAndMealType(Long menuId, MealType mealType);
}
