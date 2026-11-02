package com.celebritycrm.settings.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class NotificationSettingsRequest {

    @JsonAlias({"shootReminders", "shootScheduleReminders"})
    private Boolean shootScheduleReminders;

    @JsonAlias({"contractMilestones", "contractMilestoneAlerts"})
    private Boolean contractMilestoneAlerts;

    @JsonAlias({"campaignAlerts", "campaignProgressReports"})
    private Boolean campaignProgressReports;

    @JsonAlias({"castingSubmissions", "castingCallSubmissions"})
    private Boolean castingCallSubmissions;

    public NotificationSettingsRequest() {
    }

    public NotificationSettingsRequest(Boolean shootScheduleReminders, Boolean contractMilestoneAlerts,
                                       Boolean campaignProgressReports, Boolean castingCallSubmissions) {
        this.shootScheduleReminders = shootScheduleReminders;
        this.contractMilestoneAlerts = contractMilestoneAlerts;
        this.campaignProgressReports = campaignProgressReports;
        this.castingCallSubmissions = castingCallSubmissions;
    }

    public Boolean getShootScheduleReminders() {
        return shootScheduleReminders;
    }

    public void setShootScheduleReminders(Boolean shootScheduleReminders) {
        this.shootScheduleReminders = shootScheduleReminders;
    }

    public Boolean getShootReminders() {
        return shootScheduleReminders;
    }

    public void setShootReminders(Boolean shootReminders) {
        this.shootScheduleReminders = shootReminders;
    }

    public Boolean getContractMilestoneAlerts() {
        return contractMilestoneAlerts;
    }

    public void setContractMilestoneAlerts(Boolean contractMilestoneAlerts) {
        this.contractMilestoneAlerts = contractMilestoneAlerts;
    }

    public Boolean getContractMilestones() {
        return contractMilestoneAlerts;
    }

    public void setContractMilestones(Boolean contractMilestones) {
        this.contractMilestoneAlerts = contractMilestones;
    }

    public Boolean getCampaignProgressReports() {
        return campaignProgressReports;
    }

    public void setCampaignProgressReports(Boolean campaignProgressReports) {
        this.campaignProgressReports = campaignProgressReports;
    }

    public Boolean getCampaignAlerts() {
        return campaignProgressReports;
    }

    public void setCampaignAlerts(Boolean campaignAlerts) {
        this.campaignProgressReports = campaignAlerts;
    }

    public Boolean getCastingCallSubmissions() {
        return castingCallSubmissions;
    }

    public void setCastingCallSubmissions(Boolean castingCallSubmissions) {
        this.castingCallSubmissions = castingCallSubmissions;
    }

    public Boolean getCastingSubmissions() {
        return castingCallSubmissions;
    }

    public void setCastingSubmissions(Boolean castingSubmissions) {
        this.castingCallSubmissions = castingSubmissions;
    }
}

