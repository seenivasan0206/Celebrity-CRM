package com.celebritycrm.shoots.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class ShootRequest {

    @NotBlank(message = "Shoot title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Shoot type is required (e.g. PHOTOSHOOT, COMMERCIAL, MOVIE, OTT, INTERVIEW)")
    @Size(max = 50, message = "Shoot type must not exceed 50 characters")
    private String shootType;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @NotNull(message = "Shoot date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate shootDate;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime endTime;

    @PositiveOrZero(message = "Budget must be zero or a positive amount")
    private BigDecimal budget;

    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String status;

    private String notes;

    private Long celebrityId;

    private Long campaignId;

    public ShootRequest() {
    }

    public ShootRequest(String title, String shootType, String location, LocalDate shootDate,
                        LocalTime startTime, LocalTime endTime, BigDecimal budget,
                        String status, String notes, Long celebrityId, Long campaignId) {
        this.title = title;
        this.shootType = shootType;
        this.location = location;
        this.shootDate = shootDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.budget = budget;
        this.status = status;
        this.notes = notes;
        this.celebrityId = celebrityId;
        this.campaignId = campaignId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getShootType() {
        return shootType;
    }

    public void setShootType(String shootType) {
        this.shootType = shootType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getShootDate() {
        return shootDate;
    }

    public void setShootDate(LocalDate shootDate) {
        this.shootDate = shootDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getCelebrityId() {
        return celebrityId;
    }

    public void setCelebrityId(Long celebrityId) {
        this.celebrityId = celebrityId;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }
}

