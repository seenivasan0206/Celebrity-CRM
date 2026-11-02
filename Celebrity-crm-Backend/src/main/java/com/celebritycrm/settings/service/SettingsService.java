package com.celebritycrm.settings.service;

import com.celebritycrm.agencies.entity.Agency;
import com.celebritycrm.agencies.repository.AgencyRepository;
import com.celebritycrm.common.ResourceNotFoundException;
import com.celebritycrm.settings.dto.*;
import com.celebritycrm.settings.entity.CrmSubscription;
import com.celebritycrm.settings.entity.UserSettings;
import com.celebritycrm.settings.repository.SubscriptionRepository;
import com.celebritycrm.settings.repository.UserSettingsRepository;
import com.celebritycrm.user.entity.User;
import com.celebritycrm.user.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class SettingsService {

    private final UserRepository userRepository;
    private final AgencyRepository agencyRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PasswordEncoder passwordEncoder;

    public SettingsService(UserRepository userRepository,
                           AgencyRepository agencyRepository,
                           UserSettingsRepository userSettingsRepository,
                           SubscriptionRepository subscriptionRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.agencyRepository = agencyRepository;
        this.userSettingsRepository = userSettingsRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getUserByIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            throw new ResourceNotFoundException("User identifier cannot be empty");
        }
        return userRepository.findByUsernameOrEmailIgnoreCase(identifier.trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with identifier: " + identifier));
    }

    public UserSettings getOrCreateUserSettings(User user) {
        return userSettingsRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserSettings newSettings = new UserSettings(user);
                    return userSettingsRepository.save(newSettings);
                });
    }

    public CrmSubscription getOrCreateSubscription(User user) {
        return subscriptionRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    CrmSubscription newSub = new CrmSubscription(
                            user,
                            "Zenve VIP Enterprise",
                            "ACTIVE",
                            LocalDate.now().plusYears(1),
                            "Includes unlimited celebrity rosters, automated shoot dispatch, legal contract generation, and multi-agency collaboration."
                    );
                    return subscriptionRepository.save(newSub);
                });
    }

    @Transactional(readOnly = true)
    public ProfileSettingsResponse getProfile(String identifier) {
        User user = getUserByIdentifier(identifier);
        return mapToProfileResponse(user);
    }

    public ProfileSettingsResponse updateProfile(String identifier, ProfileSettingsRequest request) {
        User user = getUserByIdentifier(identifier);

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String newEmail = request.getEmail().trim();
            if (!newEmail.equalsIgnoreCase(user.getEmail())) {
                boolean emailTaken = userRepository.findByEmailIgnoreCase(newEmail)
                        .filter(other -> !other.getId().equals(user.getId()))
                        .isPresent();
                if (emailTaken) {
                    throw new DataIntegrityViolationException("Email " + newEmail + " is already in use by another account.");
                }
                user.setEmail(newEmail);
            }
        }

        String targetName = request.getFullName() != null && !request.getFullName().isBlank()
                ? request.getFullName().trim()
                : (request.getName() != null && !request.getName().isBlank() ? request.getName().trim() : null);

        if (targetName != null) {
            user.setFullName(targetName);
        }

        // Security: Roles are immutable through the self-service profile API to prevent privilege escalation.
        // User roles can only be managed by system administrators via dedicated user management APIs.

        if (request.getAgencyId() != null) {
            Agency agency = agencyRepository.findById(request.getAgencyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agency not found with id: " + request.getAgencyId()));
            user.setAgency(agency);
        } else if (request.getAgencyName() != null && !request.getAgencyName().isBlank()) {
            String agencyName = request.getAgencyName().trim();
            Optional<Agency> existingAgency = agencyRepository.findByNameIgnoreCase(agencyName);
            if (existingAgency.isPresent()) {
                user.setAgency(existingAgency.get());
            } else {
                Agency newAgency = new Agency();
                newAgency.setName(agencyName);
                newAgency.setStatus("ACTIVE");
                Agency savedAgency = agencyRepository.save(newAgency);
                user.setAgency(savedAgency);
            }
        }

        User updated = userRepository.save(user);
        return mapToProfileResponse(updated);
    }

    public ThemeSettingsResponse getTheme(String identifier) {
        User user = getUserByIdentifier(identifier);
        UserSettings settings = getOrCreateUserSettings(user);
        return new ThemeSettingsResponse(settings.getTheme());
    }

    public ThemeSettingsResponse updateTheme(String identifier, ThemeSettingsRequest request) {
        if (request == null || request.getTheme() == null || request.getTheme().isBlank()) {
            throw new IllegalArgumentException("Theme value cannot be blank");
        }

        User user = getUserByIdentifier(identifier);
        UserSettings settings = getOrCreateUserSettings(user);

        String rawTheme = request.getTheme().trim().toUpperCase();
        String normalizedTheme;
        if (rawTheme.contains("DARK") || rawTheme.equals("OBSIDIAN")) {
            normalizedTheme = "DARK_LUXE";
        } else if (rawTheme.contains("LIGHT") || rawTheme.equals("FROST")) {
            normalizedTheme = "LIGHT_FROST";
        } else {
            throw new IllegalArgumentException("Invalid theme: " + request.getTheme() + ". Supported themes: DARK_LUXE, LIGHT_FROST");
        }

        settings.setTheme(normalizedTheme);
        userSettingsRepository.save(settings);
        return new ThemeSettingsResponse(normalizedTheme);
    }

    public NotificationSettingsResponse getNotifications(String identifier) {
        User user = getUserByIdentifier(identifier);
        UserSettings settings = getOrCreateUserSettings(user);
        return mapToNotificationResponse(settings);
    }

    public NotificationSettingsResponse updateNotifications(String identifier, NotificationSettingsRequest request) {
        User user = getUserByIdentifier(identifier);
        UserSettings settings = getOrCreateUserSettings(user);

        if (request != null) {
            Boolean shootReminders = request.getShootScheduleReminders() != null
                    ? request.getShootScheduleReminders()
                    : request.getShootReminders();
            if (shootReminders != null) {
                settings.setShootScheduleReminders(shootReminders);
            }

            Boolean contractAlerts = request.getContractMilestoneAlerts() != null
                    ? request.getContractMilestoneAlerts()
                    : request.getContractMilestones();
            if (contractAlerts != null) {
                settings.setContractMilestoneAlerts(contractAlerts);
            }

            Boolean campaignAlerts = request.getCampaignProgressReports() != null
                    ? request.getCampaignProgressReports()
                    : request.getCampaignAlerts();
            if (campaignAlerts != null) {
                settings.setCampaignProgressReports(campaignAlerts);
            }

            Boolean castingAlerts = request.getCastingCallSubmissions() != null
                    ? request.getCastingCallSubmissions()
                    : request.getCastingSubmissions();
            if (castingAlerts != null) {
                settings.setCastingCallSubmissions(castingAlerts);
            }
        }

        UserSettings updated = userSettingsRepository.save(settings);
        return mapToNotificationResponse(updated);
    }

    public void changePassword(String identifier, PasswordChangeRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Password change request cannot be empty");
        }
        if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
            throw new IllegalArgumentException("Current password is required");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }

        User user = getUserByIdentifier(identifier);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public SubscriptionResponse getSubscription(String identifier) {
        User user = getUserByIdentifier(identifier);
        CrmSubscription sub = getOrCreateSubscription(user);
        return mapToSubscriptionResponse(sub);
    }

    public SubscriptionResponse updateSubscription(String identifier, SubscriptionUpdateRequest request) {
        User user = getUserByIdentifier(identifier);
        CrmSubscription sub = getOrCreateSubscription(user);

        if (request != null) {
            if (request.getPlanName() != null && !request.getPlanName().isBlank()) {
                sub.setPlanName(request.getPlanName().trim());
            }
            if (request.getStatus() != null && !request.getStatus().isBlank()) {
                sub.setStatus(request.getStatus().trim());
            }
            if (request.getRenewalDate() != null) {
                sub.setRenewalDate(request.getRenewalDate());
            }
            if (request.getDescription() != null && !request.getDescription().isBlank()) {
                sub.setDescription(request.getDescription().trim());
            }
        }

        CrmSubscription updated = subscriptionRepository.save(sub);
        return mapToSubscriptionResponse(updated);
    }

    public PortalSettingsResponse getAllSettings(String identifier) {
        return new PortalSettingsResponse(
                getProfile(identifier),
                getTheme(identifier),
                getNotifications(identifier),
                getSubscription(identifier)
        );
    }

    private ProfileSettingsResponse mapToProfileResponse(User user) {
        Long agencyId = user.getAgency() != null ? user.getAgency().getId() : null;
        String agencyName = user.getAgency() != null ? user.getAgency().getName() : null;
        String roleStr = user.getRole() != null ? user.getRole().name() : "ROLE_USER";

        return new ProfileSettingsResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                roleStr,
                agencyId,
                agencyName,
                user.isActive()
        );
    }

    private NotificationSettingsResponse mapToNotificationResponse(UserSettings settings) {
        return new NotificationSettingsResponse(
                settings.isShootScheduleReminders(),
                settings.isContractMilestoneAlerts(),
                settings.isCampaignProgressReports(),
                settings.isCastingCallSubmissions()
        );
    }

    private SubscriptionResponse mapToSubscriptionResponse(CrmSubscription sub) {
        return new SubscriptionResponse(
                sub.getId(),
                sub.getUser() != null ? sub.getUser().getId() : null,
                sub.getPlanName(),
                sub.getStatus(),
                sub.getRenewalDate(),
                sub.getDescription()
        );
    }
}

