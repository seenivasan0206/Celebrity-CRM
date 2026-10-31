package com.celebritycrm.reports.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public class ContractReportResponse {

    private long totalContracts;
    private long activeContracts;
    private long pendingContracts;
    private long completedContracts;
    private BigDecimal totalContractValue;
    private BigDecimal averageContractValue;
    private Map<String, Long> statusBreakdown;
    private LocalDateTime generatedAt;

    public ContractReportResponse() {
        this.generatedAt = LocalDateTime.now();
    }

    public long getTotalContracts() {
        return totalContracts;
    }

    public void setTotalContracts(long totalContracts) {
        this.totalContracts = totalContracts;
    }

    public long getActiveContracts() {
        return activeContracts;
    }

    public void setActiveContracts(long activeContracts) {
        this.activeContracts = activeContracts;
    }

    public long getPendingContracts() {
        return pendingContracts;
    }

    public void setPendingContracts(long pendingContracts) {
        this.pendingContracts = pendingContracts;
    }

    public long getCompletedContracts() {
        return completedContracts;
    }

    public void setCompletedContracts(long completedContracts) {
        this.completedContracts = completedContracts;
    }

    public BigDecimal getTotalContractValue() {
        return totalContractValue;
    }

    public void setTotalContractValue(BigDecimal totalContractValue) {
        this.totalContractValue = totalContractValue;
    }

    public BigDecimal getAverageContractValue() {
        return averageContractValue;
    }

    public void setAverageContractValue(BigDecimal averageContractValue) {
        this.averageContractValue = averageContractValue;
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

