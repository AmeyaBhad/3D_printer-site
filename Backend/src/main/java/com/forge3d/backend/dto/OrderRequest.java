package com.forge3d.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
