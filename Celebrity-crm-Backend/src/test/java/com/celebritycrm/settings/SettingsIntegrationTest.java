package com.celebritycrm.settings;

import com.celebritycrm.auth.dto.LoginRequest;
import com.celebritycrm.auth.dto.RegisterRequest;
import com.celebritycrm.settings.dto.NotificationSettingsRequest;
import com.celebritycrm.settings.dto.PasswordChangeRequest;
import com.celebritycrm.settings.dto.ProfileSettingsRequest;
import com.celebritycrm.settings.dto.ThemeSettingsRequest;
import com.celebritycrm.user.entity.Role;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SettingsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String jwtToken;

    @BeforeEach
    void setUp() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "admin123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        this.jwtToken = responseNode.get("token").asText();
    }

    @Test
    @Order(1)
    void testEndpoints_UnauthorizedWithoutToken() throws Exception {
        mockMvc.perform(get("/api/settings/profile"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/settings/theme"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/settings/notifications"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/settings/subscription"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    void testGetProfile_Success() throws Exception {
        mockMvc.perform(get("/api/settings/profile")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("admin")))
                .andExpect(jsonPath("$.email", notNullValue()))
                .andExpect(jsonPath("$.active", is(true)));
    }

    @Test
    @Order(3)
    void testUpdateProfile_Success() throws Exception {
        ProfileSettingsRequest updateReq = new ProfileSettingsRequest();
        updateReq.setFullName("Executive Administrator");
        updateReq.setEmail("admin@zenvecrm.io");
        updateReq.setAgencyName("Zenve Global Entertainment");

        mockMvc.perform(put("/api/settings/profile")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName", is("Executive Administrator")))
                .andExpect(jsonPath("$.name", is("Executive Administrator")))
                .andExpect(jsonPath("$.email", is("admin@zenvecrm.io")))
                .andExpect(jsonPath("$.agencyName", is("Zenve Global Entertainment")))
                .andExpect(jsonPath("$.agency", is("Zenve Global Entertainment")));
    }

    @Test
    @Order(4)
    void testGetAndSetTheme_Success() throws Exception {
        // GET theme
        mockMvc.perform(get("/api/settings/theme")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.theme", notNullValue()));

        // PUT theme to LIGHT_FROST
        ThemeSettingsRequest lightReq = new ThemeSettingsRequest("LIGHT_FROST");
        mockMvc.perform(put("/api/settings/theme")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(lightReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.theme", is("LIGHT_FROST")))
                .andExpect(jsonPath("$.mode", is("light")));

        // PUT theme back to DARK_LUXE
        ThemeSettingsRequest darkReq = new ThemeSettingsRequest("DARK_LUXE");
        mockMvc.perform(put("/api/settings/theme")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(darkReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.theme", is("DARK_LUXE")))
                .andExpect(jsonPath("$.mode", is("dark")));
    }

    @Test
    @Order(5)
    void testUpdateTheme_InvalidThrowsBadRequest() throws Exception {
        ThemeSettingsRequest invalidReq = new ThemeSettingsRequest("INVALID_COLOR_SCHEME");
        mockMvc.perform(put("/api/settings/theme")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(6)
    void testGetAndSetNotifications_Success() throws Exception {
        // GET initial notifications
        mockMvc.perform(get("/api/settings/notifications")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shootScheduleReminders", notNullValue()));

        // PUT notification preferences
        NotificationSettingsRequest notifReq = new NotificationSettingsRequest(false, true, true, true);
        mockMvc.perform(put("/api/settings/notifications")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notifReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shootScheduleReminders", is(false)))
                .andExpect(jsonPath("$.shootReminders", is(false)))
                .andExpect(jsonPath("$.contractMilestoneAlerts", is(true)))
                .andExpect(jsonPath("$.contractMilestones", is(true)))
                .andExpect(jsonPath("$.castingCallSubmissions", is(true)))
                .andExpect(jsonPath("$.castingSubmissions", is(true)));
    }

    @Test
    @Order(7)
    void testGetSubscription_Success() throws Exception {
        mockMvc.perform(get("/api/settings/subscription")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.planName", containsString("VIP")))
                .andExpect(jsonPath("$.status", is("ACTIVE")))
                .andExpect(jsonPath("$.renewalDate", notNullValue()));
    }

    @Test
    @Order(8)
    void testGetAllSettings_Success() throws Exception {
        mockMvc.perform(get("/api/settings")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profile.username", is("admin")))
                .andExpect(jsonPath("$.theme.theme", is("DARK_LUXE")))
                .andExpect(jsonPath("$.notifications", notNullValue()))
                .andExpect(jsonPath("$.subscription.status", is("ACTIVE")));
    }

    @Test
    @Order(9)
    void testPasswordChange_ValidationFailures() throws Exception {
        // Password too short
        PasswordChangeRequest shortPw = new PasswordChangeRequest("admin123", "123", "123");
        mockMvc.perform(put("/api/settings/password")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(shortPw)))
                .andExpect(status().isBadRequest());

        // Passwords do not match
        PasswordChangeRequest mismatchPw = new PasswordChangeRequest("admin123", "newAdmin456!", "wrongMismatch456!");
        mockMvc.perform(put("/api/settings/password")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mismatchPw)))
                .andExpect(status().isBadRequest());

        // Incorrect current password
        PasswordChangeRequest wrongCurrentPw = new PasswordChangeRequest("wrongOldPassword!", "newAdmin456!", "newAdmin456!");
        mockMvc.perform(put("/api/settings/password")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongCurrentPw)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(10)
    void testPasswordChange_DedicatedUserSuccess() throws Exception {
        // Register dedicated test user for password change
        String testUser = "pwduser_" + System.currentTimeMillis();
        String testEmail = testUser + "@crm.com";
        RegisterRequest regReq = new RegisterRequest(testUser, testEmail, "initialPass123!", "Password Test User", Role.ROLE_USER);
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isCreated());

        // Login as dedicated user
        LoginRequest loginReq = new LoginRequest(testUser, "initialPass123!");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode loginNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String userToken = loginNode.get("token").asText();

        // Change password to newPass456!
        PasswordChangeRequest changeReq = new PasswordChangeRequest("initialPass123!", "newPass456!", "newPass456!");
        mockMvc.perform(put("/api/settings/password")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changeReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Password updated successfully")));

        // Old password login fails
        LoginRequest oldLogin = new LoginRequest(testUser, "initialPass123!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(oldLogin)))
                .andExpect(status().isBadRequest());

        // New password login succeeds
        LoginRequest newLogin = new LoginRequest(testUser, "newPass456!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newLogin)))
                .andExpect(status().isOk());
    }

    @Test
    @Order(11)
    void testProfileUpdate_CannotEscalateRole() throws Exception {
        // Register normal user
        String normalUser = "normaluser_" + System.currentTimeMillis();
        RegisterRequest regReq = new RegisterRequest(normalUser, normalUser + "@crm.com", "pass123!", "Normal User", Role.ROLE_USER);
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isCreated());

        // Login as normal user
        LoginRequest loginReq = new LoginRequest(normalUser, "pass123!");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode loginNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String userToken = loginNode.get("token").asText();

        // Attempt privilege escalation to ROLE_ADMIN via PUT /api/settings/profile
        ProfileSettingsRequest hackReq = new ProfileSettingsRequest();
        hackReq.setFullName("Normal User");
        hackReq.setEmail(normalUser + "@crm.com");
        hackReq.setRole("ROLE_ADMIN");

        mockMvc.perform(put("/api/settings/profile")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(hackReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role", is("ROLE_USER"))); // Role MUST NOT be escalated to ROLE_ADMIN!

        // Confirm via GET /api/settings/profile
        mockMvc.perform(get("/api/settings/profile")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role", is("ROLE_USER")));
    }

    @Test
    @Order(12)
    void testSubscriptionUpdate_AdminAuthorization() throws Exception {
        // Register normal user
        String normalUser = "subuser_" + System.currentTimeMillis();
        RegisterRequest regReq = new RegisterRequest(normalUser, normalUser + "@crm.com", "pass123!", "Sub User", Role.ROLE_USER);
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isCreated());

        // Login as normal user
        LoginRequest loginReq = new LoginRequest(normalUser, "pass123!");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode loginNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String userToken = loginNode.get("token").asText();

        // Normal user attempting subscription update -> FORBIDDEN (403)
        com.celebritycrm.settings.dto.SubscriptionUpdateRequest subReq =
                new com.celebritycrm.settings.dto.SubscriptionUpdateRequest("VIP Platinum", "ACTIVE");

        mockMvc.perform(put("/api/settings/subscription")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subReq)))
                .andExpect(status().isForbidden());

        // Admin attempting subscription update -> OK (200)
        mockMvc.perform(put("/api/settings/subscription")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(subReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.planName", is("VIP Platinum")));
    }
}
