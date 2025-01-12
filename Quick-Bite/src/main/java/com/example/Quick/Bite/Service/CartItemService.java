package com.example.Quick.Bite.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Quick.Bite.Domain.Cart;
import com.example.Quick.Bite.Domain.CartItem;
import com.example.Quick.Bite.Domain.FoodItem;
import com.example.Quick.Bite.Repository.CartItemRepository;
import com.example.Quick.Bite.Repository.CartRepository;
import com.example.Quick.Bite.Repository.FoodItemRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;        
    
    
    public CartItem addFoodItemToCart(Long cartId, Long foodItemId, Integer quantity) {
        
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));
        FoodItem foodItem = foodItemRepository.findById(foodItemId).orElseThrow(() -> new RuntimeException("FoodItem not found"));

        if (cart.getRestaurant() != null && !cart.getRestaurant().equals(foodItem.getMenu().getRestaurant())) {
            cart.setRestaurant(foodItem.getMenu().getRestaurant());
            cartRepository.save(cart);
        }

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setFoodItem(foodItem);
        cartItem.setQuantity(quantity);

        cartItemRepository.save(cartItem);
        System.out.println("Saved CartItem: " + cartItem);

        cart.calculateTotalPrice();
        cartRepository.save(cart);

        return cartItem;
    }
    

    public CartItem getCartItemById(Long id) {
        return cartItemRepository.findById(id).orElse(null);
    }

    public List<CartItem> getCartItemsByCartId(Long cartId) {
        return cartItemRepository.findByCartId(cartId);
    }
    
    public CartItem updateCartItem(Long id, CartItem updatedCartItem) {
        List<CartItem> allCartItems = cartItemRepository.findAll();
        for (CartItem cartItem : allCartItems) {
            System.out.println("CartItem ID: " + cartItem.getId()); 
        }

        CartItem existingCartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItem not found with ID: " + id));

        existingCartItem.setQuantity(updatedCartItem.getQuantity());

        CartItem updatedItem = cartItemRepository.save(existingCartItem);
        System.out.println("Updated CartItem: " + updatedItem); 

        return updatedItem;
    }
    
    @Transactional
    public void deleteCartItem(Long id) {
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CartItem not found with ID: " + id));
        
        cartItemRepository.delete(cartItem);
        Cart cart = cartItem.getCart();
        cartRepository.save(cart);
                
    }

}
