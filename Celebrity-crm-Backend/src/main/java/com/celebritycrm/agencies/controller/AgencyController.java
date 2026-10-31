package com.celebritycrm.agencies.controller;

import com.celebritycrm.agencies.dto.AgencyRequest;
import com.celebritycrm.agencies.dto.AgencyResponse;
import com.celebritycrm.agencies.service.AgencyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agencies")
public class AgencyController {

    private final AgencyService agencyService;

    public AgencyController(AgencyService agencyService) {
        this.agencyService = agencyService;
    }

    @PostMapping
    public ResponseEntity<AgencyResponse> createAgency(@Valid @RequestBody AgencyRequest request) {
        AgencyResponse response = agencyService.createAgency(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AgencyResponse>> getAllAgencies(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(agencyService.getAllAgencies(status, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgencyResponse> getAgencyById(@PathVariable Long id) {
        return ResponseEntity.ok(agencyService.getAgencyById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgencyResponse> updateAgency(
            @PathVariable Long id,
            @Valid @RequestBody AgencyRequest request) {
        return ResponseEntity.ok(agencyService.updateAgency(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AgencyResponse> updateStatus(
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
        return ResponseEntity.ok(agencyService.updateStatus(id, resolvedStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgency(@PathVariable Long id) {
        agencyService.deleteAgency(id);
        return ResponseEntity.noContent().build();
    }
}
