package com.celebritycrm.celebrity.controller;

import com.celebritycrm.celebrity.dto.CelebrityRequest;
import com.celebritycrm.celebrity.dto.CelebrityResponse;
import com.celebritycrm.celebrity.service.CelebrityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/celebrities")
public class CelebrityController {

    private final CelebrityService celebrityService;

    public CelebrityController(CelebrityService celebrityService) {
        this.celebrityService = celebrityService;
    }

    @PostMapping
    public ResponseEntity<CelebrityResponse> createCelebrity(@Valid @RequestBody CelebrityRequest request) {
        CelebrityResponse response = celebrityService.createCelebrity(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CelebrityResponse>> getAllCelebrities(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(celebrityService.getAllCelebrities(category, status, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CelebrityResponse> getCelebrityById(@PathVariable Long id) {
        return ResponseEntity.ok(celebrityService.getCelebrityById(id));
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<CelebrityResponse>> getCelebritiesByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(celebrityService.getCelebritiesByManager(managerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CelebrityResponse> updateCelebrity(
            @PathVariable Long id,
            @Valid @RequestBody CelebrityRequest request) {
        return ResponseEntity.ok(celebrityService.updateCelebrity(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CelebrityResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestBody(required = false) Map<String, String> body) {
        String resolvedStatus = status;
        if ((resolvedStatus == null || resolvedStatus.isBlank()) && body != null && body.containsKey("status")) {
            resolvedStatus = body.get("status");
        }
        if (resolvedStatus == null || resolvedStatus.isBlank()) {
            throw new IllegalArgumentException("Status is required (provide as query parameter '?status=...' or in JSON body '{\"status\": \"...\"}')");
        }
        return ResponseEntity.ok(celebrityService.updateStatus(id, resolvedStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCelebrity(@PathVariable Long id) {
        celebrityService.deleteCelebrity(id);
        return ResponseEntity.noContent().build();
    }
}
