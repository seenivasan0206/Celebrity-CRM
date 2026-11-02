package com.celebritycrm.settings.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ProfileSettingsRequest {

    @JsonAlias({"name", "fullName"})
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String role;

    private Long agencyId;

    @JsonAlias({"agency", "agencyName"})
    private String agencyName;

    public ProfileSettingsRequest() {
    }

    public ProfileSettingsRequest(String fullName, String email, String role, Long agencyId, String agencyName) {
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.agencyId = agencyId;
        this.agencyName = agencyName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getName() {
        return fullName;
    }

    public void setName(String name) {
        this.fullName = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getAgencyId() {
        return agencyId;
    }

    public void setAgencyId(Long agencyId) {
        this.agencyId = agencyId;
    }

    public String getAgencyName() {
        return agencyName;
    }

    public void setAgencyName(String agencyName) {
        this.agencyName = agencyName;
    }

    public String getAgency() {
        return agencyName;
    }

    public void setAgency(String agency) {
        this.agencyName = agency;
    }
}

