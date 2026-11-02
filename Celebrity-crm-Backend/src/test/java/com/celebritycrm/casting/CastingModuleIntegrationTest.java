package com.celebritycrm.casting;

import com.celebritycrm.casting.dto.ApplicationStatusUpdateDto;
import com.celebritycrm.casting.dto.CastingApplicationRequestDto;
import com.celebritycrm.casting.dto.CastingCallRequestDto;
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

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CastingModuleIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static Long createdCallId;
    private static Long createdAppId;

    @Test
    @Order(1)
    void testPostCastingCallsMatchingPostman() throws Exception {
        CastingCallRequestDto callRequest = new CastingCallRequestDto(
                "Leo - Tamil Feature Film",
                "Lead Actor",
                "Looking for a talented actor for the lead role in a Tamil feature film.",
                25,
                35,
                "Male",
                "Chennai, India",
                LocalDate.parse("2026-12-31"),
                "OPEN",
                "₹5,00,000",
                "casting@example.com"
        );

        String resultJson = mockMvc.perform(post("/api/casting/calls")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.projectTitle").value("Leo - Tamil Feature Film"))
                .andExpect(jsonPath("$.roleName").value("Lead Actor"))
                .andExpect(jsonPath("$.gender").value("Male"))
                .andExpect(jsonPath("$.compensation").value("₹5,00,000"))
                .andExpect(jsonPath("$.contactEmail").value("casting@example.com"))
                .andExpect(jsonPath("$.status").value("OPEN"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        createdCallId = objectMapper.readTree(resultJson).get("id").asLong();
    }

    @Test
    @Order(2)
    void testGetAllCastingCallsMatchingPostman() throws Exception {
        mockMvc.perform(get("/api/casting/calls"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].projectTitle").isNotEmpty());
    }

    @Test
    @Order(3)
    void testGetCastingCallByIdMatchingPostman() throws Exception {
        mockMvc.perform(get("/api/casting/calls/" + createdCallId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdCallId))
                .andExpect(jsonPath("$.projectTitle").value("Leo - Tamil Feature Film"))
                .andExpect(jsonPath("$.roleName").value("Lead Actor"));
    }

    @Test
    @Order(4)
    void testUpdateCastingCallMatchingPostman() throws Exception {
        CastingCallRequestDto updateRequest = new CastingCallRequestDto(
                "Leo - Updated Tamil Feature Film",
                "Supporting Actor",
                "Looking for an experienced actor for a supporting role.",
                28,
                40,
                "Male",
                "Chennai, India",
                LocalDate.parse("2026-12-31"),
                "OPEN",
                "₹7,00,000",
                "casting@example.com"
        );

        mockMvc.perform(put("/api/casting/calls/" + createdCallId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectTitle").value("Leo - Updated Tamil Feature Film"))
                .andExpect(jsonPath("$.roleName").value("Supporting Actor"))
                .andExpect(jsonPath("$.characterAgeMin").value(28))
                .andExpect(jsonPath("$.characterAgeMax").value(40))
                .andExpect(jsonPath("$.compensation").value("₹7,00,000"));
    }

    @Test
    @Order(5)
    void testPostCastingApplicationMatchingPostman() throws Exception {
        CastingApplicationRequestDto appRequest = new CastingApplicationRequestDto(
                createdCallId,
                "Arun Kumar",
                "arun@example.com",
                "+919876543210",
                "https://example.com/portfolio/arun",
                3,
                "I have experience in Tamil films and short films. Interested in this role.",
                "SUBMITTED",
                LocalDateTime.parse("2026-11-15T10:30:00")
        );

        String resultJson = mockMvc.perform(post("/api/casting/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.applicantName").value("Arun Kumar"))
                .andExpect(jsonPath("$.applicantEmail").value("arun@example.com"))
                .andExpect(jsonPath("$.applicantPhone").value("+919876543210"))
                .andExpect(jsonPath("$.portfolioUrl").value("https://example.com/portfolio/arun"))
                .andExpect(jsonPath("$.experienceYears").value(3))
                .andExpect(jsonPath("$.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.auditionDate").value("2026-11-15T10:30:00"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        createdAppId = objectMapper.readTree(resultJson).get("id").asLong();
    }

    @Test
    @Order(6)
    void testGetAllApplicationsMatchingPostman() throws Exception {
        mockMvc.perform(get("/api/casting/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].applicantName").value("Arun Kumar"));
    }

    @Test
    @Order(7)
    void testGetApplicationByIdMatchingPostman() throws Exception {
        mockMvc.perform(get("/api/casting/applications/" + createdAppId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdAppId))
                .andExpect(jsonPath("$.applicantName").value("Arun Kumar"))
                .andExpect(jsonPath("$.applicantEmail").value("arun@example.com"))
                .andExpect(jsonPath("$.auditionDate").value("2026-11-15T10:30:00"));
    }

    @Test
    @Order(8)
    void testPatchApplicationStatusMatchingPostman() throws Exception {
        ApplicationStatusUpdateDto patchRequest = new ApplicationStatusUpdateDto(
                "SHORTLISTED",
                LocalDateTime.parse("2026-11-20T11:00:00")
        );

        mockMvc.perform(patch("/api/casting/applications/" + createdAppId + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(patchRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdAppId))
                .andExpect(jsonPath("$.status").value("SHORTLISTED"))
                .andExpect(jsonPath("$.auditionDate").value("2026-11-20T11:00:00"));
    }

    @Test
    @Order(9)
    void testDeleteApplicationMatchingPostman() throws Exception {
        mockMvc.perform(delete("/api/casting/applications/" + createdAppId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/casting/applications/" + createdAppId))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(10)
    void testDeleteCastingCallMatchingPostman() throws Exception {
        mockMvc.perform(delete("/api/casting/calls/" + createdCallId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/casting/calls/" + createdCallId))
                .andExpect(status().isNotFound());
    }
}
