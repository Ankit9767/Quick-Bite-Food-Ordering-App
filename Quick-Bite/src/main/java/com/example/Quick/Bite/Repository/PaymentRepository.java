package com.example.Quick.Bite.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Quick.Bite.Domain.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByOrderId(Long orderId);
    List<Payment> findByPaymentStatus(String paymentStatus);
}
