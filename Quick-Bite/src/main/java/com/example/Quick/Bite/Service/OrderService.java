package com.example.Quick.Bite.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Quick.Bite.Domain.Cart;
import com.example.Quick.Bite.Domain.CartItem;
import com.example.Quick.Bite.Domain.DeliveryPerson;
import com.example.Quick.Bite.Domain.Order;
import com.example.Quick.Bite.Domain.OrderItem;
import com.example.Quick.Bite.Enumerations.OrderStatus;
import com.example.Quick.Bite.Repository.CartItemRepository;
import com.example.Quick.Bite.Repository.CartRepository;
import com.example.Quick.Bite.Repository.DeliveryPersonRepository;
import com.example.Quick.Bite.Repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemService cartItemService;
    
    @Autowired
    private CartItemRepository cartItemRepository ;
    
    @Autowired
    private DeliveryPersonRepository deliveryPersonRepository;
    

    public Order createOrderFromCart(Long cartId, Long deliveryPersonId) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getRestaurant() == null) {
            throw new RuntimeException("Cart does not have a restaurant assigned.");
        }

        List<CartItem> cartItems = cartItemService.getCartItemsByCartId(cartId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty, cannot place an order.");
        }

        DeliveryPerson deliveryPerson = deliveryPersonRepository.findById(deliveryPersonId)
            .orElseThrow(() -> new RuntimeException("Delivery person not found"));

        if (!deliveryPerson.getCity().equalsIgnoreCase(cart.getRestaurant().getCity())) {
            throw new RuntimeException("Delivery person and restaurant must be in the same city.");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setRestaurant(cart.getRestaurant()); 
        order.setOrderStatus(OrderStatus.PENDING);
        order.setTotalPrice(cart.getTotalPrice());

        order.setDeliveryPerson(deliveryPerson);

        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setFoodItem(cartItem.getFoodItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getFoodItem().getPrice());
            orderItem.setOrder(order);
            return orderItem;
        }).collect(Collectors.toList());

        order.setOrderItems(orderItems);

        orderRepository.save(order);

        order.setOrderStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            int remainingQuantity = cartItem.getQuantity() - cartItem.getQuantity();

            if (remainingQuantity <= 0) {
                cartItemRepository.delete(cartItem);
            } else {
                cartItem.setQuantity(remainingQuantity);
                cartItemRepository.save(cartItem);
            }
        }

        cart.setCartItems(new ArrayList<>()); 
        cart.setTotalPrice(0.0); 
        cartRepository.save(cart);

        return order;
    }


    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByRestaurantId(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    public List<Order> getOrdersByDeliveryPersonId(Long deliveryPersonId) {
        return orderRepository.findByDeliveryPersonId(deliveryPersonId);
    }


    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByOrderStatus(status);
    }

    public Order updateOrder(Long id, Order updatedOrder) {
        if (orderRepository.existsById(id)) {
            updatedOrder.setId(id);
            return orderRepository.save(updatedOrder);
        }
        return null;
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
