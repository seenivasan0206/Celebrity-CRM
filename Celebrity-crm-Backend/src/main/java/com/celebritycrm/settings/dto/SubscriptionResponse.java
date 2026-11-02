package com.celebritycrm.settings.dto;

import java.time.LocalDate;

public class SubscriptionResponse {

    private Long id;
    private Long userId;
    private String planName;
    private String plan;
    private String status;
    private LocalDate renewalDate;
    private String description;

    public SubscriptionResponse() {
    }

    public SubscriptionResponse(Long id, Long userId, String planName, String status,
                                LocalDate renewalDate, String description) {
        this.id = id;
        this.userId = userId;
        this.planName = planName;
        this.plan = planName;
        this.status = status;
        this.renewalDate = renewalDate;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
        this.plan = planName;
    }

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
        this.planName = plan;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getRenewalDate() {
        return renewalDate;
    }

    public void setRenewalDate(LocalDate renewalDate) {
        this.renewalDate = renewalDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

