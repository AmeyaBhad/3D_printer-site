package com.forge3d.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Double price;

    private String category;

    private String image;

    private Integer stock;

    // Analytics could be a separate entity, but embedding for simplicity as per requirement
    @Embedded
    private ProductAnalytics analytics;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isArchived = false;
}
