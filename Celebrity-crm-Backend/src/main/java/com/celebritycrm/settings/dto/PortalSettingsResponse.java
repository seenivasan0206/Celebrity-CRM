package com.celebritycrm.settings.dto;

public class PortalSettingsResponse {

    private ProfileSettingsResponse profile;
    private ThemeSettingsResponse theme;
    private NotificationSettingsResponse notifications;
    private SubscriptionResponse subscription;

    public PortalSettingsResponse() {
    }

    public PortalSettingsResponse(ProfileSettingsResponse profile, ThemeSettingsResponse theme,
                                  NotificationSettingsResponse notifications, SubscriptionResponse subscription) {
        this.profile = profile;
        this.theme = theme;
        this.notifications = notifications;
        this.subscription = subscription;
    }

    public ProfileSettingsResponse getProfile() {
        return profile;
    }

    public void setProfile(ProfileSettingsResponse profile) {
        this.profile = profile;
    }

    public ThemeSettingsResponse getTheme() {
        return theme;
    }

    public void setTheme(ThemeSettingsResponse theme) {
        this.theme = theme;
    }

    public NotificationSettingsResponse getNotifications() {
        return notifications;
    }

    public void setNotifications(NotificationSettingsResponse notifications) {
        this.notifications = notifications;
    }

    public SubscriptionResponse getSubscription() {
        return subscription;
    }

    public void setSubscription(SubscriptionResponse subscription) {
        this.subscription = subscription;
    }
}

