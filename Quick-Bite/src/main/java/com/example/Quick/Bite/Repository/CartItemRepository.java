package com.example.Quick.Bite.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Quick.Bite.Domain.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	 
	    CartItem findByCartIdAndFoodItemId(Long cartId, Long foodItemId);

	    List<CartItem> findByCartId(Long cartId);
}
