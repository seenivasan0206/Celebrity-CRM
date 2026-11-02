package com.celebritycrm.settings.controller;

import com.celebritycrm.settings.dto.*;
import com.celebritycrm.settings.service.SettingsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ResponseEntity<PortalSettingsResponse> getAllSettings(Authentication authentication) {
        PortalSettingsResponse response = settingsService.getAllSettings(authentication.getName());
        return ResponseEntity.ok(response);
    }

    // 1. Profile & Agency
    @GetMapping("/profile")
    public ResponseEntity<ProfileSettingsResponse> getProfile(Authentication authentication) {
        ProfileSettingsResponse response = settingsService.getProfile(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileSettingsResponse> updateProfile(Authentication authentication,
                                                                 @Valid @RequestBody ProfileSettingsRequest request) {
        ProfileSettingsResponse response = settingsService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    // 2. Theme & Display
    @GetMapping("/theme")
    public ResponseEntity<ThemeSettingsResponse> getTheme(Authentication authentication) {
        ThemeSettingsResponse response = settingsService.getTheme(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/theme")
    public ResponseEntity<ThemeSettingsResponse> updateTheme(Authentication authentication,
                                                             @Valid @RequestBody ThemeSettingsRequest request) {
        ThemeSettingsResponse response = settingsService.updateTheme(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    // 3. Notifications
    @GetMapping("/notifications")
    public ResponseEntity<NotificationSettingsResponse> getNotifications(Authentication authentication) {
        NotificationSettingsResponse response = settingsService.getNotifications(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/notifications")
    public ResponseEntity<NotificationSettingsResponse> updateNotifications(Authentication authentication,
                                                                           @RequestBody NotificationSettingsRequest request) {
        NotificationSettingsResponse response = settingsService.updateNotifications(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    // 4. Security & Password
    @PutMapping("/password")
    public ResponseEntity<Map<String, Object>> changePassword(Authentication authentication,
                                                              @Valid @RequestBody PasswordChangeRequest request) {
        settingsService.changePassword(authentication.getName(), request);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", 200);
        response.put("message", "Password updated successfully");
        return ResponseEntity.ok(response);
    }

    // 5. Subscription Tier
    @GetMapping("/subscription")
    public ResponseEntity<SubscriptionResponse> getSubscription(Authentication authentication) {
        SubscriptionResponse response = settingsService.getSubscription(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/subscription")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROLE_ADMIN') or hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<SubscriptionResponse> updateSubscription(Authentication authentication,
                                                                   @RequestBody SubscriptionUpdateRequest request) {
        SubscriptionResponse response = settingsService.updateSubscription(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }
}

