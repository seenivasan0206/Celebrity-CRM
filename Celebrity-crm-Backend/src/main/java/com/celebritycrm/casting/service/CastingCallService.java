package com.celebritycrm.casting.service;

import com.celebritycrm.casting.dto.CastingCallRequestDto;
import com.celebritycrm.casting.dto.CastingCallResponseDto;
import com.celebritycrm.casting.entity.CastingCall;
import com.celebritycrm.casting.repository.CastingCallRepository;
import com.celebritycrm.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CastingCallService {

    private final CastingCallRepository castingCallRepository;

    public CastingCallService(CastingCallRepository castingCallRepository) {
        this.castingCallRepository = castingCallRepository;
    }

    public CastingCallResponseDto createCastingCall(CastingCallRequestDto request) {
        CastingCall castingCall = new CastingCall();
        castingCall.setProjectTitle(request.getProjectTitle());
        castingCall.setRoleName(request.getRoleName());
        castingCall.setRoleDescription(request.getRoleDescription());
        castingCall.setCharacterAgeMin(request.getCharacterAgeMin());
        castingCall.setCharacterAgeMax(request.getCharacterAgeMax());
        castingCall.setGender(request.getGender());
        castingCall.setLocation(request.getLocation());
        castingCall.setDeadline(request.getDeadline());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            castingCall.setStatus(request.getStatus().toUpperCase());
        } else {
            castingCall.setStatus("OPEN");
        }

        castingCall.setCompensation(request.getCompensation());
        castingCall.setContactEmail(request.getContactEmail());
        castingCall.setAgeGroup(request.getAgeGroup());
        castingCall.setRequirements(request.getRequirements());

        CastingCall saved = castingCallRepository.save(castingCall);
        return mapToResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public List<CastingCallResponseDto> getAllCastingCalls(String status, String search) {
        List<CastingCall> calls;
        if (status != null && !status.isBlank()) {
            calls = castingCallRepository.findByStatusIgnoreCase(status.trim());
        } else if (search != null && !search.isBlank()) {
            calls = castingCallRepository.findByProjectTitleContainingIgnoreCase(search.trim());
        } else {
            calls = castingCallRepository.findAll();
        }
        return calls.stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CastingCallResponseDto getCastingCallById(Long id) {
        CastingCall call = castingCallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Casting call not found with ID: " + id));
        return mapToResponseDto(call);
    }

    @Transactional(readOnly = true)
    public CastingCall getCastingCallEntityById(Long id) {
        return castingCallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Casting call not found with ID: " + id));
    }

    public CastingCallResponseDto updateCastingCall(Long id, CastingCallRequestDto request) {
        CastingCall call = castingCallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Casting call not found with ID: " + id));

        call.setProjectTitle(request.getProjectTitle());
        call.setRoleName(request.getRoleName());
        call.setRoleDescription(request.getRoleDescription());
        call.setCharacterAgeMin(request.getCharacterAgeMin());
        call.setCharacterAgeMax(request.getCharacterAgeMax());
        call.setGender(request.getGender());
        call.setLocation(request.getLocation());
        call.setDeadline(request.getDeadline());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            call.setStatus(request.getStatus().toUpperCase());
        }

        call.setCompensation(request.getCompensation());
        call.setContactEmail(request.getContactEmail());
        if (request.getAgeGroup() != null) {
            call.setAgeGroup(request.getAgeGroup());
        }
        if (request.getRequirements() != null) {
            call.setRequirements(request.getRequirements());
        }

        CastingCall updated = castingCallRepository.save(call);
        return mapToResponseDto(updated);
    }

    public CastingCallResponseDto updateStatus(Long id, String status) {
        CastingCall call = castingCallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Casting call not found with ID: " + id));

        if (status != null && !status.isBlank()) {
            call.setStatus(status.trim().toUpperCase());
        }

        CastingCall updated = castingCallRepository.save(call);
        return mapToResponseDto(updated);
    }

    public void deleteCastingCall(Long id) {
        if (!castingCallRepository.existsById(id)) {
            throw new ResourceNotFoundException("Casting call not found with ID: " + id);
        }
        castingCallRepository.deleteById(id);
    }

    public CastingCallResponseDto mapToResponseDto(CastingCall call) {
        int applicationsCount = (call.getApplications() != null) ? call.getApplications().size() : 0;
        return new CastingCallResponseDto(
                call.getId(),
                call.getProjectTitle(),
                call.getRoleName(),
                call.getRoleDescription(),
                call.getCharacterAgeMin(),
                call.getCharacterAgeMax(),
                call.getGender(),
                call.getLocation(),
                call.getDeadline(),
                call.getStatus(),
                call.getCompensation(),
                call.getContactEmail(),
                applicationsCount,
                call.getCreatedAt(),
                call.getUpdatedAt()
        );
    }
}
