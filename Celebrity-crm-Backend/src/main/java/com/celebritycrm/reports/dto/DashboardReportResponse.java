package com.celebritycrm.reports.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DashboardReportResponse {

    private long totalCelebrities;
    private long activeCelebrities;
    private long totalAgencies;
    private long activeAgencies;
    private long totalCampaigns;
    private long activeCampaigns;
    private long totalShoots;
    private long upcomingShoots;
    private long totalManagers;
    private BigDecimal totalCampaignBudget;
    private BigDecimal totalShootBudget;
    private LocalDateTime generatedAt;

    public DashboardReportResponse() {
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

    public long getTotalAgencies() {
        return totalAgencies;
    }

    public void setTotalAgencies(long totalAgencies) {
        this.totalAgencies = totalAgencies;
    }

    public long getActiveAgencies() {
        return activeAgencies;
    }

    public void setActiveAgencies(long activeAgencies) {
        this.activeAgencies = activeAgencies;
    }

    public long getTotalCampaigns() {
        return totalCampaigns;
    }

    public void setTotalCampaigns(long totalCampaigns) {
        this.totalCampaigns = totalCampaigns;
    }

    public long getActiveCampaigns() {
        return activeCampaigns;
    }

    public void setActiveCampaigns(long activeCampaigns) {
        this.activeCampaigns = activeCampaigns;
    }

    public long getTotalShoots() {
        return totalShoots;
    }

    public void setTotalShoots(long totalShoots) {
        this.totalShoots = totalShoots;
    }

    public long getUpcomingShoots() {
        return upcomingShoots;
    }

    public void setUpcomingShoots(long upcomingShoots) {
        this.upcomingShoots = upcomingShoots;
    }

    public long getTotalManagers() {
        return totalManagers;
    }

    public void setTotalManagers(long totalManagers) {
        this.totalManagers = totalManagers;
    }

    public BigDecimal getTotalCampaignBudget() {
        return totalCampaignBudget;
    }

    public void setTotalCampaignBudget(BigDecimal totalCampaignBudget) {
        this.totalCampaignBudget = totalCampaignBudget;
    }

    public BigDecimal getTotalShootBudget() {
        return totalShootBudget;
    }

    public void setTotalShootBudget(BigDecimal totalShootBudget) {
        this.totalShootBudget = totalShootBudget;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}

