package com.celebritycrm.reports.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public class AgencyReportResponse {

    private long totalAgencies;
    private long activeAgencies;
    private long inactiveAgencies;
    private BigDecimal averageCommissionRate;
    private Map<String, Long> countryBreakdown;
    private Map<String, Long> statusBreakdown;
    private LocalDateTime generatedAt;

    public AgencyReportResponse() {
        this.generatedAt = LocalDateTime.now();
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

    public long getInactiveAgencies() {
        return inactiveAgencies;
    }

    public void setInactiveAgencies(long inactiveAgencies) {
        this.inactiveAgencies = inactiveAgencies;
    }

    public BigDecimal getAverageCommissionRate() {
        return averageCommissionRate;
    }

    public void setAverageCommissionRate(BigDecimal averageCommissionRate) {
        this.averageCommissionRate = averageCommissionRate;
    }

    public Map<String, Long> getCountryBreakdown() {
        return countryBreakdown;
    }

    public void setCountryBreakdown(Map<String, Long> countryBreakdown) {
        this.countryBreakdown = countryBreakdown;
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

