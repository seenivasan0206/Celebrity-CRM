package com.celebritycrm.reports.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public class CelebrityReportResponse {

    private long totalCelebrities;
    private long activeCelebrities;
    private long inactiveCelebrities;
    private long busyCelebrities;
    private long totalFollowers;
    private BigDecimal averageFee;
    private Map<String, Long> categoryBreakdown;
    private Map<String, Long> statusBreakdown;
    private LocalDateTime generatedAt;

    public CelebrityReportResponse() {
        this.generatedAt = LocalDateTime.now();
    }

    public long getTotalCelebrities() {
        return totalCelebrities;
    }

    public void setTotalCelebrities(long totalCelebrities) {
        this.totalCelebrities = totalCelebrities;
    }

    public long getActiveCelebrities() {
        return activeCelebrities;
    }

    public void setActiveCelebrities(long activeCelebrities) {
        this.activeCelebrities = activeCelebrities;
    }

    public long getInactiveCelebrities() {
        return inactiveCelebrities;
    }

    public void setInactiveCelebrities(long inactiveCelebrities) {
        this.inactiveCelebrities = inactiveCelebrities;
    }

    public long getBusyCelebrities() {
        return busyCelebrities;
    }

    public void setBusyCelebrities(long busyCelebrities) {
        this.busyCelebrities = busyCelebrities;
    }

    public long getTotalFollowers() {
        return totalFollowers;
    }

    public void setTotalFollowers(long totalFollowers) {
        this.totalFollowers = totalFollowers;
    }

    public BigDecimal getAverageFee() {
        return averageFee;
    }

    public void setAverageFee(BigDecimal averageFee) {
        this.averageFee = averageFee;
    }

    public Map<String, Long> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public Map<String, Long> getStatusBreakdown() {
        return statusBreakdown;
    }

    public void setStatusBreakdown(Map<String, Long> statusBreakdown) {
        this.statusBreakdown = statusBreakdown;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}

