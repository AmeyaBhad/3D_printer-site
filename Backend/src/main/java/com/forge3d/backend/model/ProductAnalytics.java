package com.forge3d.backend.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ProductAnalytics {
    private Integer views;
    private Integer likes;
    private Double rating;
    // Sales data array would be complex to map in simple embedded, simplifying for now
    // In a real app, this would be a separate OneToMany relation
}
