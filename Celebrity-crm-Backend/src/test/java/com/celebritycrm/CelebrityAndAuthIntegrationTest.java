package com.celebritycrm;

import com.celebritycrm.agencies.dto.AgencyRequest;
import com.celebritycrm.auth.dto.LoginRequest;
import com.celebritycrm.auth.dto.RegisterRequest;
import com.celebritycrm.celebrity.dto.CelebrityRequest;
import com.celebritycrm.managers.Manager;
import com.celebritycrm.managers.ManagerRepository;
import com.celebritycrm.shoots.dto.ShootRequest;
import com.celebritycrm.user.entity.Role;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CelebrityAndAuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ManagerRepository managerRepository;

    private String jwtToken;
    private Long managerId;

    @BeforeEach
    void setUp() throws Exception {
        // Authenticate with default admin seeded by DataInitializer
        LoginRequest loginRequest = new LoginRequest("admin", "admin123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        this.jwtToken = responseNode.get("token").asText();

        // Seed a test manager if needed
        if (managerRepository.count() == 0) {
            Manager manager = new Manager("Test Talent Agency", "agency@talent.com", "+1-202-555-0143", "Apex Agency", "ACTIVE");
            Manager saved = managerRepository.save(manager);
            this.managerId = saved.getId();
        } else {
            this.managerId = managerRepository.findAll().get(0).getId();
        }
    }

    @Test
    void testAuthEndpoints_RegisterLoginAndMe() throws Exception {
        String uniqueUser = "testuser_" + System.currentTimeMillis();
        String uniqueEmail = uniqueUser + "@test.com";

        // 1. Register new user
        RegisterRequest registerReq = new RegisterRequest(uniqueUser, uniqueEmail, "password123", "Test User", Role.ROLE_USER);
        MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.username").value(uniqueUser))
                .andReturn();

        JsonNode regNode = objectMapper.readTree(registerResult.getResponse().getContentAsString());
        String userToken = regNode.get("token").asText();

        // 2. Fetch /api/auth/me with new token
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(uniqueUser))
                .andExpect(jsonPath("$.email").value(uniqueEmail));
    }

    @Test
    void testCelebrityCrudWorkflow() throws Exception {
        // 1. Public GET request without token should succeed (200 OK)
        mockMvc.perform(get("/api/celebrities"))
                .andExpect(status().isOk());

        // 2. Unauthorized write request (POST) without token should return 401
        CelebrityRequest unauthorizedReq = new CelebrityRequest();
        unauthorizedReq.setName("Unauthorized Test");
        unauthorizedReq.setCategory("ACTOR");
        mockMvc.perform(post("/api/celebrities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(unauthorizedReq)))
                .andExpect(status().isUnauthorized());

        // 2. Create Celebrity with Bearer Token
        CelebrityRequest req = new CelebrityRequest(
                "Keanu Reeves",
                "Keanu",
                "ACTOR",
                "keanu." + System.currentTimeMillis() + "@matrix.com",
                "+1-310-555-0199",
                "Male",
                "Renowned Hollywood actor famous for Matrix and John Wick.",
                "@keanureeves_official",
                12500000L,
                BigDecimal.valueOf(500000.00),
                "ACTIVE",
                managerId
        );

        MvcResult createResult = mockMvc.perform(post("/api/celebrities")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Keanu Reeves"))
                .andExpect(jsonPath("$.category").value("ACTOR"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andReturn();

        JsonNode createNode = objectMapper.readTree(createResult.getResponse().getContentAsString());
        Long celebrityId = createNode.get("id").asLong();

        // 3. Get Celebrity by ID
        mockMvc.perform(get("/api/celebrities/" + celebrityId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(celebrityId))
                .andExpect(jsonPath("$.name").value("Keanu Reeves"));

        // 4. Update Celebrity
        req.setBio("Updated bio: Global cinema icon.");
        req.setStatus("BUSY");
        mockMvc.perform(put("/api/celebrities/" + celebrityId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("BUSY"))
                .andExpect(jsonPath("$.bio").value("Updated bio: Global cinema icon."));

        // 5. Patch Status
        mockMvc.perform(patch("/api/celebrities/" + celebrityId + "/status")
                        .header("Authorization", "Bearer " + jwtToken)
                        .param("status", "ACTIVE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"));

        // 6. Delete Celebrity
        mockMvc.perform(delete("/api/celebrities/" + celebrityId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());

        // 7. Verify not found after deletion
        mockMvc.perform(get("/api/celebrities/" + celebrityId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void testAgencyCrudWorkflow() throws Exception {
        // 1. Public GET request without token should succeed (200 OK)
        mockMvc.perform(get("/api/agencies"))
                .andExpect(status().isOk());

        // 2. Unauthorized write request (POST) without token should return 401
        AgencyRequest unauthorizedReq = new AgencyRequest();
        unauthorizedReq.setName("Unauthorized Agency");
        mockMvc.perform(post("/api/agencies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(unauthorizedReq)))
                .andExpect(status().isUnauthorized());

        // 3. Create Agency with Bearer Token
        String uniqueAgency = "Agency_" + System.currentTimeMillis();
        AgencyRequest req = new AgencyRequest(
                uniqueAgency,
                "contact@" + uniqueAgency.toLowerCase() + ".com",
                "+1-212-555-0199",
                "https://www." + uniqueAgency.toLowerCase() + ".com",
                "100 Broadway, New York, NY",
                "United States",
                BigDecimal.valueOf(10.00),
                "Premier talent management agency.",
                "ACTIVE"
        );

        MvcResult createResult = mockMvc.perform(post("/api/agencies")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value(uniqueAgency))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andReturn();

        JsonNode createNode = objectMapper.readTree(createResult.getResponse().getContentAsString());
        Long agencyId = createNode.get("id").asLong();

        // 4. Get Agency by ID
        mockMvc.perform(get("/api/agencies/" + agencyId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(agencyId))
                .andExpect(jsonPath("$.name").value(uniqueAgency));

        // 5. Update Agency
        req.setDescription("Updated agency description with global branches.");
        req.setStatus("ACTIVE");
        mockMvc.perform(put("/api/agencies/" + agencyId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Updated agency description with global branches."));

        // 6. Patch Status via query param
        mockMvc.perform(patch("/api/agencies/" + agencyId + "/status")
                        .header("Authorization", "Bearer " + jwtToken)
                        .param("status", "INACTIVE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("INACTIVE"));

        // 6b. Patch Status via JSON body
        mockMvc.perform(patch("/api/agencies/" + agencyId + "/status")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"ACTIVE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"));

        // 7. Delete Agency
        mockMvc.perform(delete("/api/agencies/" + agencyId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());

        // 8. Verify not found after deletion
        mockMvc.perform(get("/api/agencies/" + agencyId))
                .andExpect(status().isNotFound());
    }

    @Test
    void testAgencyValidationRules() throws Exception {
        // Validation Test 1: Blank name should return 400 with field error
        AgencyRequest blankNameReq = new AgencyRequest("", "valid@email.com", null, null, null, null, null, null, "ACTIVE");
        mockMvc.perform(post("/api/agencies")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(blankNameReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").value("Agency name is required"));

        // Validation Test 2: Invalid email format should return 400
        AgencyRequest invalidEmailReq = new AgencyRequest("Test Agency", "invalid-email-address", null, null, null, null, null, null, "ACTIVE");
        mockMvc.perform(post("/api/agencies")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidEmailReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").value("Please provide a valid email address"));

        // Validation Test 3: Commission rate > 100 should return 400
        AgencyRequest highCommReq = new AgencyRequest("Valid Agency", "agency@test.com", null, null, null, null, BigDecimal.valueOf(150.00), null, "ACTIVE");
        mockMvc.perform(post("/api/agencies")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(highCommReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.commissionRate").value("Commission rate cannot exceed 100%"));

        // Validation Test 4: Duplicate agency name should return 400 Bad Request
        String dupName = "Unique_Agency_" + System.currentTimeMillis();
        AgencyRequest firstAgency = new AgencyRequest(dupName, "dup1@test.com", null, null, null, null, null, null, "ACTIVE");
        mockMvc.perform(post("/api/agencies")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(firstAgency)))
                .andExpect(status().isCreated());

        AgencyRequest duplicateAgency = new AgencyRequest(dupName, "dup2@test.com", null, null, null, null, null, null, "ACTIVE");
        mockMvc.perform(post("/api/agencies")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateAgency)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Agency with name '" + dupName + "' already exists."));
    }

    @Test
    void testShootCrudAndValidation() throws Exception {
        // 1. Public GET /api/shoots works without token
        mockMvc.perform(get("/api/shoots"))
                .andExpect(status().isOk());

        // 2. Unauthorized POST returns 401
        ShootRequest unauthReq = new ShootRequest();
        unauthReq.setTitle("Unauthorized Shoot");
        unauthReq.setShootType("PHOTOSHOOT");
        unauthReq.setShootDate(LocalDate.now().plusDays(5));
        mockMvc.perform(post("/api/shoots")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(unauthReq)))
                .andExpect(status().isUnauthorized());

        // 3. Validation: Missing title or shootDate returns 400
        ShootRequest badReq = new ShootRequest();
        badReq.setTitle("");
        badReq.setShootType("PHOTOSHOOT");
        mockMvc.perform(post("/api/shoots")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").value("Shoot title is required"))
                .andExpect(jsonPath("$.errors.shootDate").value("Shoot date is required"));

        // 4. Create Shoot with token
        ShootRequest validReq = new ShootRequest(
                "Winter Brand Campaign Shoot",
                "COMMERCIAL",
                "Studio 5, Film City",
                LocalDate.now().plusDays(10),
                LocalTime.of(9, 0),
                LocalTime.of(18, 0),
                BigDecimal.valueOf(85000.00),
                "SCHEDULED",
                "High production brand ad shoot.",
                null,
                null
        );

        MvcResult createResult = mockMvc.perform(post("/api/shoots")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.title").value("Winter Brand Campaign Shoot"))
                .andExpect(jsonPath("$.shootType").value("COMMERCIAL"))
                .andReturn();

        JsonNode jsonNode = objectMapper.readTree(createResult.getResponse().getContentAsString());
        Long shootId = jsonNode.get("id").asLong();

        // 5. Get Shoot by ID
        mockMvc.perform(get("/api/shoots/" + shootId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(shootId))
                .andExpect(jsonPath("$.title").value("Winter Brand Campaign Shoot"));

        // 6. Update Shoot
        validReq.setLocation("Updated Outdoor Studio");
        mockMvc.perform(put("/api/shoots/" + shootId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.location").value("Updated Outdoor Studio"));

        // 7. Patch Status via JSON Body
        mockMvc.perform(patch("/api/shoots/" + shootId + "/status")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"COMPLETED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));

        // 8. Delete Shoot
        mockMvc.perform(delete("/api/shoots/" + shootId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());

        // 9. Verify 404
        mockMvc.perform(get("/api/shoots/" + shootId))
                .andExpect(status().isNotFound());
    }

    @Test
    void testReportsEndpoints() throws Exception {
        // 1. Dashboard Report
        mockMvc.perform(get("/api/reports/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCelebrities").isNumber())
                .andExpect(jsonPath("$.totalAgencies").isNumber())
                .andExpect(jsonPath("$.totalCampaigns").isNumber())
                .andExpect(jsonPath("$.totalShoots").isNumber());

        // 2. Celebrities Report
        mockMvc.perform(get("/api/reports/celebrities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCelebrities").isNumber())
                .andExpect(jsonPath("$.averageFee").isNumber());

        // 3. Agencies Report
        mockMvc.perform(get("/api/reports/agencies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAgencies").isNumber());

        // 4. Campaigns Report
        mockMvc.perform(get("/api/reports/campaigns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCampaigns").isNumber());

        // 5. Shoots Report
        mockMvc.perform(get("/api/reports/shoots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalShoots").isNumber());

        // 6. Contracts Report
        mockMvc.perform(get("/api/reports/contracts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalContracts").isNumber());

        // 7. OTT Projects Report
        mockMvc.perform(get("/api/reports/ott-projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalOttProjects").isNumber());
    }
}

