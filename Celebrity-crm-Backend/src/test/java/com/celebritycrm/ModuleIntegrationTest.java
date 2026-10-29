package com.celebritycrm;

import com.celebritycrm.campaigns.dto.CampaignRequest;
import com.celebritycrm.managers.dto.ManagerRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ModuleIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @Order(1)
    void testManagerAndCampaignFlow() throws Exception {
        // 1. Create a Manager
        ManagerRequest managerRequest = new ManagerRequest(
                "Anirudh Ravichander Manager",
                "talent.mgr." + System.currentTimeMillis() + "@music.com",
                "9876543210",
                "Rockstar Management",
                "ACTIVE"
        );

        String managerResultJson = mockMvc.perform(post("/api/managers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(managerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Anirudh Ravichander Manager"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long managerId = objectMapper.readTree(managerResultJson).get("id").asLong();

        // 2. Get All Managers
        mockMvc.perform(get("/api/managers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));

        // 3. Get Manager By ID
        mockMvc.perform(get("/api/managers/" + managerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(managerId))
                .andExpect(jsonPath("$.name").value("Anirudh Ravichander Manager"));

        // 4. Create Campaign associated with this Manager
        CampaignRequest campaignRequest = new CampaignRequest(
                "Concert Tour 2026",
                "Spotify",
                new BigDecimal("500000.00"),
                LocalDate.now(),
                LocalDate.now().plusMonths(3),
                "PLANNING",
                "Global tour endorsement campaign",
                managerId
        );

        String campaignResultJson = mockMvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(campaignRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Concert Tour 2026"))
                .andExpect(jsonPath("$.managerId").value(managerId))
                .andExpect(jsonPath("$.managerName").value("Anirudh Ravichander Manager"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long campaignId = objectMapper.readTree(campaignResultJson).get("id").asLong();

        // 5. Get All Campaigns
        mockMvc.perform(get("/api/campaigns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));

        // 6. Get Campaign By Manager
        mockMvc.perform(get("/api/campaigns/manager/" + managerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].name").value("Concert Tour 2026"));

        // 7. Update Campaign Status
        mockMvc.perform(patch("/api/campaigns/" + campaignId + "/status?status=ACTIVE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"));

        // 8. Delete Campaign
        mockMvc.perform(delete("/api/campaigns/" + campaignId))
                .andExpect(status().isNoContent());

        // 9. Delete Manager
        mockMvc.perform(delete("/api/managers/" + managerId))
                .andExpect(status().isNoContent());
    }
}

