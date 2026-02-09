package com.forge3d.backend.controller;

import com.forge3d.backend.dto.OrderRequest;
import com.forge3d.backend.model.Order;
import com.forge3d.backend.model.User;
import com.forge3d.backend.service.OrderService;
import com.forge3d.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody OrderRequest request) {
        // In a real app with proper JWT, we'd extract ID from token.
        // For this hybrid/session setup, we'll fetch the user by email from UserDetails
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(orderService.placeOrder(user.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(@AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(orderService.getUserOrders(user.getId()));
    }
}
