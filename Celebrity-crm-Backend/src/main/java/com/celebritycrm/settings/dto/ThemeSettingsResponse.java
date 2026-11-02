package com.celebritycrm.settings.dto;

public class ThemeSettingsResponse {

    private String theme;
    private String mode;

    public ThemeSettingsResponse() {
    }

    public ThemeSettingsResponse(String theme) {
        this.theme = theme;
        this.mode = (theme != null && theme.toUpperCase().contains("LIGHT")) ? "light" : "dark";
    }

    public ThemeSettingsResponse(String theme, String mode) {
        this.theme = theme;
        this.mode = mode;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
        this.mode = (theme != null && theme.toUpperCase().contains("LIGHT")) ? "light" : "dark";
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }
}

