package com.celebritycrm.settings.dto;

public class NotificationSettingsResponse {

    private boolean shootScheduleReminders;
    private boolean shootReminders;
    private boolean contractMilestoneAlerts;
    private boolean contractMilestones;
    private boolean campaignProgressReports;
    private boolean campaignAlerts;
    private boolean castingCallSubmissions;
    private boolean castingSubmissions;

    public NotificationSettingsResponse() {
    }

    public NotificationSettingsResponse(boolean shootScheduleReminders, boolean contractMilestoneAlerts,
                                        boolean campaignProgressReports, boolean castingCallSubmissions) {
        this.shootScheduleReminders = shootScheduleReminders;
        this.shootReminders = shootScheduleReminders;
        this.contractMilestoneAlerts = contractMilestoneAlerts;
        this.contractMilestones = contractMilestoneAlerts;
        this.campaignProgressReports = campaignProgressReports;
        this.campaignAlerts = campaignProgressReports;
        this.castingCallSubmissions = castingCallSubmissions;
        this.castingSubmissions = castingCallSubmissions;
    }

    public boolean isShootScheduleReminders() {
        return shootScheduleReminders;
    }

    public void setShootScheduleReminders(boolean shootScheduleReminders) {
        this.shootScheduleReminders = shootScheduleReminders;
        this.shootReminders = shootScheduleReminders;
    }

    public boolean isShootReminders() {
        return shootReminders;
    }

    public void setShootReminders(boolean shootReminders) {
        this.shootReminders = shootReminders;
        this.shootScheduleReminders = shootReminders;
    }

    public boolean isContractMilestoneAlerts() {
        return contractMilestoneAlerts;
    }

    public void setContractMilestoneAlerts(boolean contractMilestoneAlerts) {
        this.contractMilestoneAlerts = contractMilestoneAlerts;
        this.contractMilestones = contractMilestoneAlerts;
    }

    public boolean isContractMilestones() {
        return contractMilestones;
    }

    public void setContractMilestones(boolean contractMilestones) {
        this.contractMilestones = contractMilestones;
        this.contractMilestoneAlerts = contractMilestones;
    }

    public boolean isCampaignProgressReports() {
        return campaignProgressReports;
    }

    public void setCampaignProgressReports(boolean campaignProgressReports) {
        this.campaignProgressReports = campaignProgressReports;
        this.campaignAlerts = campaignProgressReports;
    }

    public boolean isCampaignAlerts() {
        return campaignAlerts;
    }

    public void setCampaignAlerts(boolean campaignAlerts) {
        this.campaignAlerts = campaignAlerts;
        this.campaignProgressReports = campaignAlerts;
    }

    public boolean isCastingCallSubmissions() {
        return castingCallSubmissions;
    }

    public void setCastingCallSubmissions(boolean castingCallSubmissions) {
        this.castingCallSubmissions = castingCallSubmissions;
        this.castingSubmissions = castingCallSubmissions;
    }

    public boolean isCastingSubmissions() {
        return castingSubmissions;
    }

    public void setCastingSubmissions(boolean castingSubmissions) {
        this.castingSubmissions = castingSubmissions;
        this.castingCallSubmissions = castingSubmissions;
    }
}

