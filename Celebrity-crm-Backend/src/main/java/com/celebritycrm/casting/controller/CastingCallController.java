package com.celebritycrm.casting.controller;

import com.celebritycrm.casting.dto.ApplicationStatusUpdateDto;
import com.celebritycrm.casting.dto.CastingApplicationRequestDto;
import com.celebritycrm.casting.dto.CastingApplicationResponseDto;
import com.celebritycrm.casting.dto.CastingCallRequestDto;
import com.celebritycrm.casting.dto.CastingCallResponseDto;
import com.celebritycrm.casting.service.CastingApplicationService;
import com.celebritycrm.casting.service.CastingCallService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/casting/calls", "/api/casting-calls"})
public class CastingCallController {

    private final CastingCallService castingCallService;
    private final CastingApplicationService castingApplicationService;

    public CastingCallController(CastingCallService castingCallService,
                                 CastingApplicationService castingApplicationService) {
        this.castingCallService = castingCallService;
        this.castingApplicationService = castingApplicationService;
    }

    @PostMapping
    public ResponseEntity<CastingCallResponseDto> createCastingCall(@Valid @RequestBody CastingCallRequestDto request) {
        CastingCallResponseDto response = castingCallService.createCastingCall(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CastingCallResponseDto>> getAllCastingCalls(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(castingCallService.getAllCastingCalls(status, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CastingCallResponseDto> getCastingCallById(@PathVariable Long id) {
        return ResponseEntity.ok(castingCallService.getCastingCallById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CastingCallResponseDto> updateCastingCall(
            @PathVariable Long id,
            @Valid @RequestBody CastingCallRequestDto request) {
        return ResponseEntity.ok(castingCallService.updateCastingCall(id, request));
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<CastingCallResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestBody(required = false) ApplicationStatusUpdateDto statusDto) {
        String newStatus = (statusDto != null && statusDto.getStatus() != null && !statusDto.getStatus().isBlank())
                ? statusDto.getStatus()
                : status;
        return ResponseEntity.ok(castingCallService.updateStatus(id, newStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCastingCall(@PathVariable Long id) {
        castingCallService.deleteCastingCall(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<List<CastingApplicationResponseDto>> getApplicationsForCastingCall(@PathVariable Long id) {
        return ResponseEntity.ok(castingApplicationService.getApplicationsByCastingCall(id));
    }

    @PostMapping("/{id}/applications")
    public ResponseEntity<CastingApplicationResponseDto> createApplicationForCastingCall(
            @PathVariable Long id,
            @Valid @RequestBody CastingApplicationRequestDto request) {
        CastingApplicationResponseDto response = castingApplicationService.createApplicationForCastingCall(id, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
