package com.example.Quick.Bite.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Quick.Bite.Domain.Order;
import com.example.Quick.Bite.Enumerations.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByRestaurantId(Long restaurantId);
    List<Order> findByDeliveryPersonId(Long deliveryPersonId);
    List<Order> findByOrderStatus(OrderStatus orderStatus);}
