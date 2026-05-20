package com.printeddimensions.backend.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.ElementCollection;
import java.util.List;

@Embeddable
public class ProductAnalytics {
    private Integer views;
    private Integer likes;
    private Double rating;
    
    private Double revenue;
    private Integer unitsSold;

    @ElementCollection
    private List<Integer> salesData;

    public ProductAnalytics() {
    }

    public ProductAnalytics(Integer views, Integer likes, Double rating, Double revenue, Integer unitsSold, List<Integer> salesData) {
        this.views = views;
        this.likes = likes;
        this.rating = rating;
        this.revenue = revenue;
        this.unitsSold = unitsSold;
        this.salesData = salesData;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }

    public Integer getUnitsSold() {
        return unitsSold;
    }

    public void setUnitsSold(Integer unitsSold) {
        this.unitsSold = unitsSold;
    }

    public List<Integer> getSalesData() {
        return salesData;
    }

    public void setSalesData(List<Integer> salesData) {
        this.salesData = salesData;
    }
}
