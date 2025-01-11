package com.example.Quick.Bite.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Quick.Bite.Domain.FoodItem;
import com.example.Quick.Bite.Enumerations.FoodItemAvailability;
import com.example.Quick.Bite.Service.FoodItemService;

@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @PostMapping("/add")
    public FoodItem createFoodItem(@RequestBody FoodItem foodItem) {
        return foodItemService.createFoodItem(foodItem);
    }

    @GetMapping("/{id}")
    public FoodItem getFoodItemById(@PathVariable Long id) {
        return foodItemService.getFoodItemById(id);
    }

    @GetMapping("/menu/{menuId}")
    public List<FoodItem> getFoodItemsByMenuId(@PathVariable Long menuId) {
        return foodItemService.getFoodItemsByMenuId(menuId);
    }

    @GetMapping("/availability/{availability}")
    public List<FoodItem> getFoodItemsByAvailability(@PathVariable FoodItemAvailability availability) {
        return foodItemService.getFoodItemsByAvailability(availability);
    }

    @PutMapping("/update/{id}")
    public FoodItem updateFoodItem(@PathVariable Long id, @RequestBody FoodItem updatedFoodItem) {
        return foodItemService.updateFoodItem(id, updatedFoodItem);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteFoodItem(@PathVariable Long id) {
        foodItemService.deleteFoodItem(id);
    }
}
