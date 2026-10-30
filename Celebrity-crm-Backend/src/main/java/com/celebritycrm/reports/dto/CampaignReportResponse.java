package com.celebritycrm.reports.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public class CampaignReportResponse {

    private long totalCampaigns;
    private long planningCampaigns;
    private long activeCampaigns;
    private long completedCampaigns;
    private long cancelledCampaigns;
    private BigDecimal totalBudget;
    private BigDecimal averageBudget;
    private Map<String, Long> statusBreakdown;
    private LocalDateTime generatedAt;

    public CampaignReportResponse() {
        this.generatedAt = LocalDateTime.now();
    }

    public long getTotalCampaigns() {
        return totalCampaigns;
    }

    public void setTotalCampaigns(long totalCampaigns) {
        this.totalCampaigns = totalCampaigns;
    }

    public long getPlanningCampaigns() {
        return planningCampaigns;
    }

    public void setPlanningCampaigns(long planningCampaigns) {
        this.planningCampaigns = planningCampaigns;
    }

    public long getActiveCampaigns() {
        return activeCampaigns;
    }

    public void setActiveCampaigns(long activeCampaigns) {
        this.activeCampaigns = activeCampaigns;
    }

    public long getCompletedCampaigns() {
        return completedCampaigns;
    }

    public void setCompletedCampaigns(long completedCampaigns) {
        this.completedCampaigns = completedCampaigns;
    }

    public long getCancelledCampaigns() {
        return cancelledCampaigns;
    }

    public void setCancelledCampaigns(long cancelledCampaigns) {
        this.cancelledCampaigns = cancelledCampaigns;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public BigDecimal getAverageBudget() {
        return averageBudget;
    }

    public void setAverageBudget(BigDecimal averageBudget) {
        this.averageBudget = averageBudget;
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

