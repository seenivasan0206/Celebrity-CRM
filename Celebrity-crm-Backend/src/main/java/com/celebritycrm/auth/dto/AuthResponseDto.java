package com.celebritycrm.auth.dto;

import com.celebritycrm.auth.entity.User;

public class AuthResponseDto {

    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String message;

    public AuthResponseDto() {
    }

    public static AuthResponseDto success(String token, User user, String message) {
        AuthResponseDto dto = new AuthResponseDto();
        dto.setToken(token);
        dto.setTokenType("Bearer");
        dto.setId(user.getId());
        dto.setUserId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        dto.setMessage(message);
        return dto;
    }

    public static AuthResponseDto success(String token, com.celebritycrm.user.entity.User user, String message) {
        AuthResponseDto dto = new AuthResponseDto();
        dto.setToken(token);
        dto.setTokenType("Bearer");
        dto.setId(user.getId());
        dto.setUserId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole() != null ? user.getRole().name() : "USER");
        dto.setMessage(message);
        return dto;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getId() {
        return id != null ? id : userId;
    }

    public void setId(Long id) {
        this.id = id;
        this.userId = id;
    }

    public Long getUserId() {
        return userId != null ? userId : id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
        this.id = userId;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

