package com.celebritycrm.settings.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SubscriptionUpdateRequest {

    @JsonAlias({"plan", "planName"})
    private String planName;

    private String status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @JsonAlias({"renewalDate", "renewal_date"})
    private LocalDate renewalDate;

    private String description;

    public SubscriptionUpdateRequest() {
    }

    public SubscriptionUpdateRequest(String planName, String status) {
        this.planName = planName;
        this.status = status;
    }

    public SubscriptionUpdateRequest(String planName, String status, LocalDate renewalDate) {
        this.planName = planName;
        this.status = status;
        this.renewalDate = renewalDate;
    }

    public SubscriptionUpdateRequest(String planName, String status, LocalDate renewalDate, String description) {
        this.planName = planName;
        this.status = status;
        this.renewalDate = renewalDate;
        this.description = description;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getPlan() {
        return planName;
    }

    public void setPlan(String plan) {
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
