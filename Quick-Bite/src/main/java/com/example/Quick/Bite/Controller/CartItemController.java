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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Quick.Bite.Domain.CartItem;
import com.example.Quick.Bite.Service.CartItemService;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    @PostMapping("/add")
    public CartItem addFoodItemToCart(@RequestParam Long cartId, @RequestParam Long foodItemId, @RequestParam Integer quantity) {
        return cartItemService.addFoodItemToCart(cartId, foodItemId, quantity);
    }

    @GetMapping("/cart/{id}")
    public CartItem getCartItemById(@PathVariable Long id) {
        return cartItemService.getCartItemById(id);
    }

    @GetMapping("/cart/all/{cartId}")
    public List<CartItem> getCartItemsByCartId(@PathVariable Long cartId) {
    	List<CartItem> items = cartItemService.getCartItemsByCartId(cartId);
    	 return items;
    }

    @PutMapping("/update/{id}")
    public CartItem updateCartItem(@PathVariable Long id, @RequestBody CartItem updatedCartItem) {
    	    return cartItemService.updateCartItem(id, updatedCartItem);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteCartItem(@PathVariable Long id) {
        cartItemService.deleteCartItem(id);
    }
}
