package com.celebritycrm.reports.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public class ShootReportResponse {

    private long totalShoots;
    private long scheduledShoots;
    private long inProgressShoots;
    private long completedShoots;
    private long cancelledShoots;
    private BigDecimal totalShootBudget;
    private Map<String, Long> shootTypeBreakdown;
    private Map<String, Long> statusBreakdown;
    private LocalDateTime generatedAt;

    public ShootReportResponse() {
        this.generatedAt = LocalDateTime.now();
    }

    public long getTotalShoots() {
        return totalShoots;
    }

    public void setTotalShoots(long totalShoots) {
        this.totalShoots = totalShoots;
    }

    public long getScheduledShoots() {
        return scheduledShoots;
    }

    public void setScheduledShoots(long scheduledShoots) {
        this.scheduledShoots = scheduledShoots;
    }

    public long getInProgressShoots() {
        return inProgressShoots;
    }

    public void setInProgressShoots(long inProgressShoots) {
        this.inProgressShoots = inProgressShoots;
    }

    public long getCompletedShoots() {
        return completedShoots;
    }

    public void setCompletedShoots(long completedShoots) {
        this.completedShoots = completedShoots;
    }

    public long getCancelledShoots() {
        return cancelledShoots;
    }

    public void setCancelledShoots(long cancelledShoots) {
        this.cancelledShoots = cancelledShoots;
    }

    public BigDecimal getTotalShootBudget() {
        return totalShootBudget;
    }

    public void setTotalShootBudget(BigDecimal totalShootBudget) {
        this.totalShootBudget = totalShootBudget;
    }

    public Map<String, Long> getShootTypeBreakdown() {
        return shootTypeBreakdown;
    }

    public void setShootTypeBreakdown(Map<String, Long> shootTypeBreakdown) {
        this.shootTypeBreakdown = shootTypeBreakdown;
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

