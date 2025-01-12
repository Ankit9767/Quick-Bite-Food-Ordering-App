package com.example.Quick.Bite.Domain;

import java.util.List;

import com.example.Quick.Bite.Enumerations.CartStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private OrgUser user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
    @JsonManagedReference 
    private List<CartItem> cartItems;
    
    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)  
    private Restaurant restaurant; 

    @Column(name = "status", nullable = false)
    private CartStatus status;
    
    @Column(name = "total_price")
    private Double totalPrice = 0.0;

    public Cart() {}

    public Cart(Long id, OrgUser user, CartStatus status,Restaurant restaurant) {
        this.id = id;
        this.user = user;
        this.status = status;
        this.restaurant = restaurant;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OrgUser getUser() {
        return user;
    }

    public void setUser(OrgUser user) {
        this.user = user;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public CartStatus getStatus() {
        return status;
    }

    public void setStatus(CartStatus status) {
        this.status = status;
    }
    
    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public void calculateTotalPrice() {
        this.totalPrice = cartItems.stream()
                .mapToDouble(cartItem -> cartItem.getFoodItem().getPrice() * cartItem.getQuantity())
                .sum();
    }

	public Restaurant getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}
	
    public void setRestaurantId(Long restaurantId) {
        this.restaurant = new Restaurant();
        this.restaurant.setId(restaurantId);
    }
}
