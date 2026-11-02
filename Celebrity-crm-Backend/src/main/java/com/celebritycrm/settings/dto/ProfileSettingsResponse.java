package com.celebritycrm.settings.dto;

public class ProfileSettingsResponse {

    private Long id;
    private String username;
    private String fullName;
    private String name;
    private String email;
    private String role;
    private Long agencyId;
    private String agencyName;
    private String agency;
    private boolean active;

    public ProfileSettingsResponse() {
    }

    public ProfileSettingsResponse(Long id, String username, String fullName, String email,
                                   String role, Long agencyId, String agencyName, boolean active) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.name = fullName;
        this.email = email;
        this.role = role;
        this.agencyId = agencyId;
        this.agencyName = agencyName;
        this.agency = agencyName;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
        this.name = fullName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
        this.agency = agencyName;
    }

    public String getAgency() {
        return agency;
    }

    public void setAgency(String agency) {
        this.agency = agency;
        this.agencyName = agency;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

