package com.forge3d.backend.service;

import com.forge3d.backend.dto.OrderRequest;
import com.forge3d.backend.exception.ResourceNotFoundException;
import com.forge3d.backend.model.Order;
import com.forge3d.backend.model.OrderItem;
import com.forge3d.backend.model.Product;
import com.forge3d.backend.model.User;
import com.forge3d.backend.repository.OrderRepository;
import com.forge3d.backend.repository.ProductRepository;
import com.forge3d.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order placeOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = Order.builder()
                .user(user)
                .status(Order.OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();

        double totalAmount = 0;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemRequest.getProductId()));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }

            // Deduct stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .price(product.getPrice())
                    .build();

            order.getItems().add(orderItem);
            totalAmount += product.getPrice() * itemRequest.getQuantity();
        }

        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }
}
