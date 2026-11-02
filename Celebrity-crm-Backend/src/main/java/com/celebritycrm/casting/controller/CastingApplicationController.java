package com.celebritycrm.casting.controller;

import com.celebritycrm.casting.dto.ApplicationStatusUpdateDto;
import com.celebritycrm.casting.dto.CastingApplicationRequestDto;
import com.celebritycrm.casting.dto.CastingApplicationResponseDto;
import com.celebritycrm.casting.service.CastingApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/casting/applications", "/api/casting-applications", "/api/applications"})
public class CastingApplicationController {

    private final CastingApplicationService castingApplicationService;

    public CastingApplicationController(CastingApplicationService castingApplicationService) {
        this.castingApplicationService = castingApplicationService;
    }

    @PostMapping
    public ResponseEntity<CastingApplicationResponseDto> createApplication(
            @Valid @RequestBody CastingApplicationRequestDto request) {
        CastingApplicationResponseDto response = castingApplicationService.createApplication(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CastingApplicationResponseDto>> getAllApplications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long castingCallId) {
        return ResponseEntity.ok(castingApplicationService.getAllApplications(status, castingCallId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CastingApplicationResponseDto> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(castingApplicationService.getApplicationById(id));
    }

    @GetMapping({"/casting-call/{castingCallId}", "/casting-calls/{castingCallId}"})
    public ResponseEntity<List<CastingApplicationResponseDto>> getApplicationsByCastingCall(
            @PathVariable Long castingCallId) {
        return ResponseEntity.ok(castingApplicationService.getApplicationsByCastingCall(castingCallId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CastingApplicationResponseDto> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody CastingApplicationRequestDto request) {
        return ResponseEntity.ok(castingApplicationService.updateApplication(id, request));
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<CastingApplicationResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestBody(required = false) ApplicationStatusUpdateDto statusDto,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(castingApplicationService.updateStatus(id, statusDto, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        castingApplicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}
