package com.example.Quick.Bite.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Quick.Bite.Domain.Menu;
import com.example.Quick.Bite.Enumerations.MenuCategory;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findByCategory(MenuCategory category);

    Menu findByRestaurantId(Long restaurantId);	 
}
