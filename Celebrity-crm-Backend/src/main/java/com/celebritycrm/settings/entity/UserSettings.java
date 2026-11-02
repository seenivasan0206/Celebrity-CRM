package com.celebritycrm.settings.entity;

import com.celebritycrm.user.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(nullable = false, length = 30)
    private String theme = "DARK_LUXE";

    @Column(name = "shoot_schedule_reminders", nullable = false)
    private boolean shootScheduleReminders = true;

    @Column(name = "contract_milestone_alerts", nullable = false)
    private boolean contractMilestoneAlerts = true;

    @Column(name = "campaign_progress_reports", nullable = false)
    private boolean campaignProgressReports = true;

    @Column(name = "casting_call_submissions", nullable = false)
    private boolean castingCallSubmissions = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public UserSettings() {
    }

    public UserSettings(User user) {
        this.user = user;
        this.theme = "DARK_LUXE";
        this.shootScheduleReminders = true;
        this.contractMilestoneAlerts = true;
        this.campaignProgressReports = true;
        this.castingCallSubmissions = false;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.theme == null || this.theme.isBlank()) {
            this.theme = "DARK_LUXE";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public boolean isShootScheduleReminders() {
        return shootScheduleReminders;
    }

    public void setShootScheduleReminders(boolean shootScheduleReminders) {
        this.shootScheduleReminders = shootScheduleReminders;
    }

    public boolean isContractMilestoneAlerts() {
        return contractMilestoneAlerts;
    }

    public void setContractMilestoneAlerts(boolean contractMilestoneAlerts) {
        this.contractMilestoneAlerts = contractMilestoneAlerts;
    }

    public boolean isCampaignProgressReports() {
        return campaignProgressReports;
    }

    public void setCampaignProgressReports(boolean campaignProgressReports) {
        this.campaignProgressReports = campaignProgressReports;
    }

    public boolean isCastingCallSubmissions() {
        return castingCallSubmissions;
    }

    public void setCastingCallSubmissions(boolean castingCallSubmissions) {
        this.castingCallSubmissions = castingCallSubmissions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

