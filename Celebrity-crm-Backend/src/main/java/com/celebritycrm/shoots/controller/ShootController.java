package com.celebritycrm.shoots.controller;

import com.celebritycrm.shoots.dto.ShootRequest;
import com.celebritycrm.shoots.dto.ShootResponse;
import com.celebritycrm.shoots.service.ShootService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shoots")
public class ShootController {

    private final ShootService shootService;

    public ShootController(ShootService shootService) {
        this.shootService = shootService;
    }

    @PostMapping
    public ResponseEntity<ShootResponse> createShoot(@Valid @RequestBody ShootRequest request) {
        ShootResponse response = shootService.createShoot(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ShootResponse>> getAllShoots(
            @RequestParam(required = false) String shootType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long celebrityId,
            @RequestParam(required = false) Long campaignId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(shootService.getAllShoots(shootType, status, celebrityId, campaignId, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShootResponse> getShootById(@PathVariable Long id) {
        return ResponseEntity.ok(shootService.getShootById(id));
    }

    @GetMapping("/celebrity/{celebrityId}")
    public ResponseEntity<List<ShootResponse>> getShootsByCelebrity(@PathVariable Long celebrityId) {
        return ResponseEntity.ok(shootService.getShootsByCelebrity(celebrityId));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<ShootResponse>> getShootsByCampaign(@PathVariable Long campaignId) {
        return ResponseEntity.ok(shootService.getShootsByCampaign(campaignId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShootResponse> updateShoot(
            @PathVariable Long id,
            @Valid @RequestBody ShootRequest request) {
        return ResponseEntity.ok(shootService.updateShoot(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ShootResponse> updateStatus(
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
        return ResponseEntity.ok(shootService.updateStatus(id, resolvedStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShoot(@PathVariable Long id) {
        shootService.deleteShoot(id);
        return ResponseEntity.noContent().build();
    }
}

