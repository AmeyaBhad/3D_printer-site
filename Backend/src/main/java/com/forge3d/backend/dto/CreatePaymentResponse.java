package com.forge3d.backend.dto;

/**
 * Returned to the frontend after the backend creates a Razorpay order.
 * Frontend uses these fields to open the Razorpay checkout widget.
 */
public class CreatePaymentResponse {
    private Long orderId;             // our Order.id
    private String razorpayOrderId;   // Razorpay's order_id
    private String razorpayKeyId;     // public key, safe to send
    private long amountPaise;         // amount in smallest currency unit
    private String currency;

    public CreatePaymentResponse() {}

    public CreatePaymentResponse(Long orderId, String razorpayOrderId, String razorpayKeyId, long amountPaise, String currency) {
        this.orderId = orderId;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayKeyId = razorpayKeyId;
        this.amountPaise = amountPaise;
        this.currency = currency;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public String getRazorpayKeyId() { return razorpayKeyId; }
    public void setRazorpayKeyId(String razorpayKeyId) { this.razorpayKeyId = razorpayKeyId; }
    public long getAmountPaise() { return amountPaise; }
    public void setAmountPaise(long amountPaise) { this.amountPaise = amountPaise; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
