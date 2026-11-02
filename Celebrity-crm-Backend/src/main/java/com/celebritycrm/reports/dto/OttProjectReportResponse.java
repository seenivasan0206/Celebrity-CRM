package com.celebritycrm.reports.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

public class OttProjectReportResponse {

    private long totalOttProjects;
    private long inProductionCount;
    private long releasedCount;
    private long plannedCount;
    private BigDecimal totalBudget;
    private Map<String, Long> platformBreakdown;
    private Map<String, Long> genreBreakdown;
    private LocalDateTime generatedAt;

    public OttProjectReportResponse() {
        this.generatedAt = LocalDateTime.now();
    }

    public long getTotalOttProjects() {
        return totalOttProjects;
    }

    public void setTotalOttProjects(long totalOttProjects) {
        this.totalOttProjects = totalOttProjects;
    }

    public long getInProductionCount() {
        return inProductionCount;
    }

    public void setInProductionCount(long inProductionCount) {
        this.inProductionCount = inProductionCount;
    }

    public long getReleasedCount() {
        return releasedCount;
    }

    public void setReleasedCount(long releasedCount) {
        this.releasedCount = releasedCount;
    }

    public long getPlannedCount() {
        return plannedCount;
    }

    public void setPlannedCount(long plannedCount) {
        this.plannedCount = plannedCount;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public Map<String, Long> getPlatformBreakdown() {
        return platformBreakdown;
    }

    public void setPlatformBreakdown(Map<String, Long> platformBreakdown) {
        this.platformBreakdown = platformBreakdown;
    }

    public Map<String, Long> getGenreBreakdown() {
        return genreBreakdown;
    }

    public void setGenreBreakdown(Map<String, Long> genreBreakdown) {
        this.genreBreakdown = genreBreakdown;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}

