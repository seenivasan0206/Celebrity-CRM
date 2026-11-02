package com.celebritycrm.auth;

import com.celebritycrm.auth.dto.LoginRequestDto;
import com.celebritycrm.auth.dto.RegisterRequestDto;
import com.celebritycrm.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.findByUsername("sarah_connor").ifPresent(userRepository::delete);
        userRepository.findByEmail("sarah@example.com").ifPresent(userRepository::delete);
    }

    @Test
    void testRegisterAndLoginFlow() throws Exception {
        // 1. Register a new user
        RegisterRequestDto registerDto = new RegisterRequestDto(
                "sarah_connor",
                "sarah@example.com",
                "securePass123!",
                "Sarah Connor",
                "CASTING_DIRECTOR"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").exists())
                .andExpect(jsonPath("$.username").value("sarah_connor"))
                .andExpect(jsonPath("$.email").value("sarah@example.com"))
                .andExpect(jsonPath("$.role").value("CASTING_DIRECTOR"))
                .andExpect(jsonPath("$.token").value(notNullValue()))
                .andExpect(jsonPath("$.tokenType").value("Bearer"));

        // 2. Login with username POST
        LoginRequestDto loginByUsername = new LoginRequestDto("sarah_connor", "securePass123!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginByUsername)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("sarah_connor"))
                .andExpect(jsonPath("$.token").value(notNullValue()))
                .andExpect(jsonPath("$.message").value("Login successful"));

        // 3. Login with email POST
        LoginRequestDto loginByEmail = new LoginRequestDto("sarah@example.com", "securePass123!");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginByEmail)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("sarah_connor"));

        // 4. Login via GET
        mockMvc.perform(get("/api/auth/login?username=sarah_connor&password=securePass123!"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(notNullValue()))
                .andExpect(jsonPath("$.username").value("sarah_connor"));

        // 5. Login with invalid password
        LoginRequestDto badLogin = new LoginRequestDto("sarah_connor", "wrongPassword");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badLogin)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid username/email or password"));
    }
}

