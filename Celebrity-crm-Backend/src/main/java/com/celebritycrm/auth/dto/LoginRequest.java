package com.celebritycrm.auth.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class LoginRequest {

    @JsonAlias({ "username", "email", "identifier" })
    private String usernameOrEmail;

    private String username;
    private String email;

    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    public String getUsernameOrEmail() {
        if (usernameOrEmail != null && !usernameOrEmail.isBlank()) {
            return usernameOrEmail.trim();
        }
        if (username != null && !username.isBlank()) {
            return username.trim();
        }
        if (email != null && !email.isBlank()) {
            return email.trim();
        }
        return "";
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
        if (this.usernameOrEmail == null || this.usernameOrEmail.isBlank()) {
            this.usernameOrEmail = username;
        }
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
        if (this.usernameOrEmail == null || this.usernameOrEmail.isBlank()) {
            this.usernameOrEmail = email;
        }
    }

    public String getIdentifier() {
        return getUsernameOrEmail();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

