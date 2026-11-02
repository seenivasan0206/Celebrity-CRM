package com.celebritycrm.auth.service;

import com.celebritycrm.auth.dto.AuthResponse;
import com.celebritycrm.auth.dto.LoginRequest;
import com.celebritycrm.auth.dto.RegisterRequest;
import com.celebritycrm.auth.dto.UserResponse;
import com.celebritycrm.common.ResourceNotFoundException;
import com.celebritycrm.security.JwtUtils;
import com.celebritycrm.user.entity.Role;
import com.celebritycrm.user.entity.User;
import com.celebritycrm.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByUsername(username) || userRepository.existsByUsernameIgnoreCase(username)) {
            throw new IllegalArgumentException("Username '" + username + "' is already taken.");
        }

        if (userRepository.existsByEmail(email) || userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email '" + email + "' is already registered.");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_USER;

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName() != null ? request.getFullName().trim() : username);
        user.setRole(role);
        user.setActive(true);

        User saved = userRepository.save(user);

        String token = jwtUtils.generateToken(saved.getUsername(), saved.getRole().name());

        return new AuthResponse(
                token,
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getFullName(),
                saved.getRole().name(),
                "Registration successful"
        );
    }

    public AuthResponse login(LoginRequest request) {
        String rawIdentifier = request.getUsernameOrEmail();
        if (rawIdentifier == null || rawIdentifier.isBlank()) {
            throw new IllegalArgumentException("Username or email must be provided");
        }
        final String identifier = rawIdentifier.trim();

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .or(() -> userRepository.findByUsernameIgnoreCase(identifier))
                .or(() -> userRepository.findByEmailIgnoreCase(identifier))
                .or(() -> userRepository.findByUsernameOrEmail(identifier, identifier))
                .orElseThrow(() -> new IllegalArgumentException("Invalid username/email or password"));

        if (!user.isActive()) {
            throw new IllegalArgumentException("Account is inactive. Please contact support");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            boolean fallbackMatches = PasswordUtil.verifyPassword(request.getPassword(), user.getPassword())
                    || request.getPassword().equals(user.getPassword());
            if (!fallbackMatches) {
                throw new IllegalArgumentException("Invalid username/email or password");
            }
        }

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole().name());

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                "Login successful"
        );
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByUsernameIgnoreCase(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());
        response.setActive(user.isActive());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
