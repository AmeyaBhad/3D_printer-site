package com.forge3d.backend.service;

import com.forge3d.backend.dto.CreatePaymentResponse;
import com.forge3d.backend.exception.ResourceNotFoundException;
import com.forge3d.backend.model.Order;
import com.forge3d.backend.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;

/**
 * Talks to Razorpay's REST API directly (no SDK dependency).
 * - Order creation: POST https://api.razorpay.com/v1/orders with HTTP basic auth.
 * - Signature verification: HMAC-SHA256(razorpay_order_id|razorpay_payment_id, key_secret),
 *   compared to the razorpay_signature returned by Razorpay Checkout.
 */
@Service
public class PaymentService {

    private static final String API_BASE = "https://api.razorpay.com/v1";

    private final OrderRepository orderRepository;
    private final RestClient http = RestClient.builder().build();

    @Value("${razorpay.key-id}")
    private String keyId;
    @Value("${razorpay.key-secret}")
    private String keySecret;
    @Value("${razorpay.currency}")
    private String currency;

    public PaymentService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public boolean isConfigured() {
        return keyId != null && !keyId.isBlank() && keySecret != null && !keySecret.isBlank();
    }

    /**
     * Creates a Razorpay order for the given local Order and persists the Razorpay order_id on it.
     */
    public CreatePaymentResponse createPaymentFor(Order order) {
        if (!isConfigured()) {
            throw new IllegalStateException("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
        }
        long amountPaise = Math.round(order.getTotalAmount() * 100.0);
        String receipt = "order_" + order.getId();

        String basic = Base64.getEncoder().encodeToString((keyId + ":" + keySecret).getBytes(StandardCharsets.UTF_8));

        Map<?, ?> body;
        try {
            body = http.post()
                    .uri(API_BASE + "/orders")
                    .header(HttpHeaders.AUTHORIZATION, "Basic " + basic)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .body(Map.of(
                            "amount", amountPaise,
                            "currency", currency,
                            "receipt", receipt,
                            "payment_capture", 1
                    ))
                    .retrieve()
                    .body(Map.class);
        } catch (Exception ex) {
            throw new IllegalStateException("Razorpay order creation failed: " + ex.getMessage(), ex);
        }

        if (body == null || body.get("id") == null) {
            throw new IllegalStateException("Razorpay returned an empty response");
        }

        String rzpOrderId = body.get("id").toString();
        order.setRazorpayOrderId(rzpOrderId);
        orderRepository.save(order);

        return new CreatePaymentResponse(order.getId(), rzpOrderId, keyId, amountPaise, currency);
    }

    /**
     * Verifies the signature returned by Razorpay Checkout and, if valid, marks the Order as PAID.
     */
    public Order verifyAndMarkPaid(Long orderId, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (order.getRazorpayOrderId() == null || !order.getRazorpayOrderId().equals(razorpayOrderId)) {
            throw new IllegalArgumentException("Razorpay order_id mismatch for order " + orderId);
        }

        String expectedSignature = hmacSha256(keySecret, razorpayOrderId + "|" + razorpayPaymentId);
        if (!constantTimeEquals(expectedSignature, razorpaySignature)) {
            order.setPaymentStatus(Order.PaymentStatus.FAILED);
            orderRepository.save(order);
            throw new IllegalArgumentException("Razorpay signature verification failed");
        }

        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setPaymentStatus(Order.PaymentStatus.PAID);
        return orderRepository.save(order);
    }

    private static String hmacSha256(String secret, String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Could not compute HMAC: " + ex.getMessage(), ex);
        }
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null || a.length() != b.length()) return false;
        int diff = 0;
        for (int i = 0; i < a.length(); i++) diff |= a.charAt(i) ^ b.charAt(i);
        return diff == 0;
    }
}
