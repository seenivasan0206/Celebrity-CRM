package com.celebritycrm.ott;

import com.celebritycrm.ott.project.dto.OttProjectRequestDto;
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
class OttProjectIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static Long createdProjectId;

    @Test
    @Order(1)
    void testCreateOttProjectMatchingPostman() throws Exception {
        OttProjectRequestDto request = new OttProjectRequestDto(
                "Leo - The OTT Special",
                "Exclusive behind-the-scenes and director's cut series",
                "Netflix",
                "Action / Thriller",
                "IN_PRODUCTION",
                "Lokesh Kanagaraj",
                "Seven Screen Studio",
                new BigDecimal("75000000.0"),
                LocalDate.parse("2027-04-14")
        );

        String resultJson = mockMvc.perform(post("/api/ott/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.title").value("Leo - The OTT Special"))
                .andExpect(jsonPath("$.platform").value("Netflix"))
                .andExpect(jsonPath("$.director").value("Lokesh Kanagaraj"))
                .andExpect(jsonPath("$.producer").value("Seven Screen Studio"))
                .andExpect(jsonPath("$.status").value("IN_PRODUCTION"))
                .andExpect(jsonPath("$.releaseDate").value("2027-04-14"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        createdProjectId = objectMapper.readTree(resultJson).get("id").asLong();
    }

    @Test
    @Order(2)
    void testGetAllOttProjectsMatchingPostman() throws Exception {
        mockMvc.perform(get("/api/ott/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @Order(3)
    void testGetOttProjectByIdMatchingPostman() throws Exception {
        mockMvc.perform(get("/api/ott/projects/" + createdProjectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdProjectId))
                .andExpect(jsonPath("$.title").value("Leo - The OTT Special"))
                .andExpect(jsonPath("$.director").value("Lokesh Kanagaraj"));
    }

    @Test
    @Order(4)
    void testUpdateOttProjectMatchingPostman() throws Exception {
        OttProjectRequestDto updateRequest = new OttProjectRequestDto(
                "Leo - OTT Director's Cut",
                "Updated exclusive behind-the-scenes and extended director's cut series",
                "Amazon Prime Video",
                "Action / Thriller / Drama",
                "COMPLETED",
                "Lokesh Kanagaraj",
                "Seven Screen Studio",
                new BigDecimal("85000000.0"),
                LocalDate.parse("2027-04-14")
        );

        mockMvc.perform(put("/api/ott/projects/" + createdProjectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Leo - OTT Director's Cut"))
                .andExpect(jsonPath("$.platform").value("Amazon Prime Video"))
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.budget").value(85000000.0));
    }

    @Test
    @Order(5)
    void testDeleteOttProjectMatchingPostman() throws Exception {
        mockMvc.perform(delete("/api/ott/projects/" + createdProjectId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/ott/projects/" + createdProjectId))
                .andExpect(status().isNotFound());
    }
}
