package com.celebritycrm.settings.dto;

import jakarta.validation.constraints.NotBlank;

public class ThemeSettingsRequest {

    @NotBlank(message = "Theme cannot be blank")
    private String theme;

    public ThemeSettingsRequest() {
    }

    public ThemeSettingsRequest(String theme) {
        this.theme = theme;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }
}

