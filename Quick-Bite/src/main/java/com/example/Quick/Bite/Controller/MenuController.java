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

import com.example.Quick.Bite.Domain.Menu;
import com.example.Quick.Bite.Service.MenuService;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
	
	
    @Autowired
    private MenuService menuService;

    @PostMapping("/add")
    public Menu createMenu(@RequestBody Menu menu) {
        return menuService.createMenu(menu);
    }

    @GetMapping("/{id}")
    public Menu getMenuById(@PathVariable Long id) {
        return menuService.getMenuById(id);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public Menu getMenuByRestaurantId(@PathVariable Long restaurantId) {
        return menuService.getMenuByRestaurantId(restaurantId);
    }

    @PutMapping("/update/{id}")
    public Menu updateMenu(@PathVariable Long id, @RequestBody Menu updatedMenu) {
        return menuService.updateMenu(id, updatedMenu);
    }
    
    @GetMapping("/all")
    public List<Menu> getAllMenus() {
        return menuService.getAllMenus();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
    }
}
