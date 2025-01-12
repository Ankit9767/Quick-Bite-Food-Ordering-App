package com.example.Quick.Bite.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Quick.Bite.Domain.Cart;
import com.example.Quick.Bite.Repository.CartRepository;

@Service
public class CartService {
	
	private final Logger log = LoggerFactory.getLogger(OrgUserService.class);

    @Autowired
    private CartRepository cartRepository;    
    
    public Cart createCart(Cart cart) {
        log.info("Creating cart for user: {}", cart.getUser().getUserName());
        Cart savedCart = cartRepository.save(cart);
        log.info("Cart saved with ID: {}", savedCart.getId());
        return savedCart;
    }


    public Cart getCartById(Long id) {
        return cartRepository.findById(id).orElse(null);
    }

    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public Cart updateCart(Long id, Cart updatedCart) {
        if (cartRepository.existsById(id)) {
            updatedCart.setId(id);
            return cartRepository.save(updatedCart);
        }
        return null;
    }

    public void deleteCart(Long id) {
        cartRepository.deleteById(id);
    }
    
    
}
