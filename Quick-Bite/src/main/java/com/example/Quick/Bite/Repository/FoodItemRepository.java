package com.example.Quick.Bite.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Quick.Bite.Domain.FoodItem;
import com.example.Quick.Bite.Enumerations.FoodItemAvailability;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByMenuId(Long menuId);
    List<FoodItem> findByAvailability(FoodItemAvailability availability);    
}
