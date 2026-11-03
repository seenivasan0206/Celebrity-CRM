package com.celebritycrm.auth.dto;

import com.celebritycrm.user.entity.Role;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    @Size(max = 150, message = "Full name must not exceed 150 characters")
    private String fullName;

    private String agency;

    private Role role = Role.ROLE_USER;

    public RegisterRequest() {
    }

    public RegisterRequest(String username, String email, String password, String fullName, Role role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = (role != null) ? role : Role.ROLE_USER;
    }

    public RegisterRequest(String username, String email, String password, String fullName, String roleStr) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        setRoleString(roleStr);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAgency() {
        return agency;
    }

    public void setAgency(String agency) {
        this.agency = agency;
    }

    public Role getRole() {
        return role != null ? role : Role.ROLE_USER;
    }

    public void setRole(Role role) {
        this.role = role != null ? role : Role.ROLE_USER;
    }

    @JsonProperty("role")
    public void setRoleString(String roleStr) {
        if (roleStr == null || roleStr.isBlank()) {
            this.role = Role.ROLE_USER;
            return;
        }
        String clean = roleStr.trim().toUpperCase().replace(" ", "_");
        try {
            this.role = Role.valueOf(clean);
        } catch (IllegalArgumentException e1) {
            try {
                this.role = Role.valueOf("ROLE_" + clean);
            } catch (IllegalArgumentException e2) {
                if (clean.contains("ADMIN") || clean.contains("PARTNER")) {
                    this.role = Role.ROLE_ADMIN;
                } else if (clean.contains("MANAGER") || clean.contains("HEAD") || clean.contains("PRODUCER")) {
                    this.role = Role.ROLE_MANAGER;
                } else if (clean.contains("CASTING")) {
                    this.role = Role.ROLE_CASTING_DIRECTOR;
                } else {
                    this.role = Role.ROLE_USER;
                }
            }
        }
    }
}
