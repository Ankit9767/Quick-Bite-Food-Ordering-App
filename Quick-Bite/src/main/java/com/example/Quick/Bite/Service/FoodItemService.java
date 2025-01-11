package com.example.Quick.Bite.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Quick.Bite.Domain.FoodItem;
import com.example.Quick.Bite.Enumerations.FoodItemAvailability;
import com.example.Quick.Bite.Repository.FoodItemRepository;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    public FoodItem createFoodItem(FoodItem foodItem) {
        return foodItemRepository.save(foodItem);
    }

    public FoodItem getFoodItemById(Long id) {
        return foodItemRepository.findById(id).orElse(null);
    }

    public List<FoodItem> getFoodItemsByMenuId(Long menuId) {
        return foodItemRepository.findByMenuId(menuId);
    }

    public List<FoodItem> getFoodItemsByAvailability(FoodItemAvailability availability) {
        return foodItemRepository.findByAvailability(availability);
    }

    public FoodItem updateFoodItem(Long id, FoodItem updatedFoodItem) {
        if (foodItemRepository.existsById(id)) {
            updatedFoodItem.setId(id);
            return foodItemRepository.save(updatedFoodItem);
        }
        return null;
    }

    public void deleteFoodItem(Long id) {
        foodItemRepository.deleteById(id);
    }
}
