package com.example.Quick.Bite.Service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Quick.Bite.Domain.Menu;
import com.example.Quick.Bite.Repository.MenuRepository;

@Service
public class MenuService {

    @Autowired
    private MenuRepository menuRepository;

    public Menu createMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    public Menu getMenuById(Long id) {
        return menuRepository.findById(id).orElse(null);
    }

    public Menu getMenuByRestaurantId(Long restaurantId) {
        return menuRepository.findByRestaurantId(restaurantId);
    }

    public Menu updateMenu(Long id, Menu updatedMenu) {
        if (menuRepository.existsById(id)) {
            updatedMenu.setId(id);
            return menuRepository.save(updatedMenu);
        }
        return null;
    }

    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }
    
    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }
}
