package com.printeddimensions.backend.controller;

import com.printeddimensions.backend.dto.CreatePaymentResponse;
import com.printeddimensions.backend.dto.VerifyPaymentRequest;
import com.printeddimensions.backend.exception.ResourceNotFoundException;
import com.printeddimensions.backend.model.Order;
import com.printeddimensions.backend.model.User;
import com.printeddimensions.backend.repository.OrderRepository;
import com.printeddimensions.backend.service.PaymentService;
import com.printeddimensions.backend.service.UserService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderRepository orderRepository;
    private final UserService userService;

    public PaymentController(PaymentService paymentService,
                             OrderRepository orderRepository,
                             UserService userService) {
        this.paymentService = paymentService;
        this.orderRepository = orderRepository;
        this.userService = userService;
    }

    /** Public — frontend uses this to decide whether to show the Razorpay flow. */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> config() {
        return ResponseEntity.ok(Map.of(
                "enabled", paymentService.isConfigured()
        ));
    }

    @PostMapping("/orders/{orderId}")
    public ResponseEntity<CreatePaymentResponse> createPayment(@AuthenticationPrincipal UserDetails userDetails,
                                                               @PathVariable Long orderId) {
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Order does not belong to current user");
        }
        if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
            throw new IllegalArgumentException("Order is already paid");
        }
        return ResponseEntity.ok(paymentService.createPaymentFor(order));
    }

    @PostMapping("/verify")
    public ResponseEntity<Order> verifyPayment(@AuthenticationPrincipal UserDetails userDetails,
                                               @RequestParam Long orderId,
                                               @Valid @RequestBody VerifyPaymentRequest body) {
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Order does not belong to current user");
        }
        return ResponseEntity.ok(paymentService.verifyAndMarkPaid(
                orderId,
                body.getRazorpayOrderId(),
                body.getRazorpayPaymentId(),
                body.getRazorpaySignature()
        ));
    }
}
