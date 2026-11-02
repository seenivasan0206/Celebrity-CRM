package com.celebritycrm.casting.service;

import com.celebritycrm.casting.dto.ApplicationStatusUpdateDto;
import com.celebritycrm.casting.dto.CastingApplicationRequestDto;
import com.celebritycrm.casting.dto.CastingApplicationResponseDto;
import com.celebritycrm.casting.entity.CastingApplication;
import com.celebritycrm.casting.entity.CastingCall;
import com.celebritycrm.casting.repository.CastingApplicationRepository;
import com.celebritycrm.casting.repository.CastingCallRepository;
import com.celebritycrm.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CastingApplicationService {

    private final CastingApplicationRepository castingApplicationRepository;
    private final CastingCallRepository castingCallRepository;

    public CastingApplicationService(CastingApplicationRepository castingApplicationRepository,
                                     CastingCallRepository castingCallRepository) {
        this.castingApplicationRepository = castingApplicationRepository;
        this.castingCallRepository = castingCallRepository;
    }

    public CastingApplicationResponseDto createApplication(CastingApplicationRequestDto request) {
        if (request.getCastingCallId() == null) {
            throw new IllegalArgumentException("Casting call ID is required to submit an application.");
        }

        Long callId = request.getCastingCallId();
        CastingCall castingCall = castingCallRepository.findById(callId)
                .orElseThrow(() -> new ResourceNotFoundException("Casting call not found with ID: " + callId));

        CastingApplication application = new CastingApplication();
        application.setCastingCall(castingCall);
        application.setApplicantName(request.getApplicantName());
        application.setApplicantEmail(request.getApplicantEmail() != null ? request.getApplicantEmail() : request.getEmail());
        application.setApplicantPhone(request.getApplicantPhone() != null ? request.getApplicantPhone() : request.getPhone());
        application.setPortfolioUrl(request.getPortfolioUrl() != null ? request.getPortfolioUrl() : request.getTapeUrl());
        application.setExperienceYears(request.getExperienceYears());
        application.setNotes(request.getNotes());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            application.setStatus(request.getStatus().toUpperCase());
        } else {
            application.setStatus("SUBMITTED");
        }

        application.setAuditionDate(request.getAuditionDate());

        if (request.getAppliedRole() != null && !request.getAppliedRole().isBlank()) {
            application.setAppliedRole(request.getAppliedRole());
        } else if (castingCall.getRoleName() != null) {
            application.setAppliedRole(castingCall.getRoleName());
        } else {
            application.setAppliedRole(castingCall.getProjectTitle());
        }

        application.setCity(request.getCity());
        application.setRating(request.getRating());

        CastingApplication saved = castingApplicationRepository.save(application);
        return mapToResponseDto(saved);
    }

    public CastingApplicationResponseDto createApplicationForCastingCall(Long castingCallId, CastingApplicationRequestDto request) {
        request.setCastingCallId(castingCallId);
        return createApplication(request);
    }

    @Transactional(readOnly = true)
    public List<CastingApplicationResponseDto> getAllApplications(String status, Long castingCallId) {
        List<CastingApplication> list;
        if (castingCallId != null && status != null && !status.isBlank()) {
            list = castingApplicationRepository.findByCastingCallIdAndStatusIgnoreCase(castingCallId, status.trim());
        } else if (castingCallId != null) {
            list = castingApplicationRepository.findByCastingCallId(castingCallId);
        } else if (status != null && !status.isBlank()) {
            list = castingApplicationRepository.findByStatusIgnoreCase(status.trim());
        } else {
            list = castingApplicationRepository.findAll();
        }
        return list.stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CastingApplicationResponseDto getApplicationById(Long id) {
        CastingApplication application = castingApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Casting application not found with ID: " + id));
        return mapToResponseDto(application);
    }

    @Transactional(readOnly = true)
    public List<CastingApplicationResponseDto> getApplicationsByCastingCall(Long castingCallId) {
        if (!castingCallRepository.existsById(castingCallId)) {
            throw new ResourceNotFoundException("Casting call not found with ID: " + castingCallId);
        }
        return castingApplicationRepository.findByCastingCallId(castingCallId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public CastingApplicationResponseDto updateApplication(Long id, CastingApplicationRequestDto request) {
        CastingApplication application = castingApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Casting application not found with ID: " + id));

        if (request.getCastingCallId() != null) {
            Long callId = request.getCastingCallId();
            CastingCall castingCall = castingCallRepository.findById(callId)
                    .orElseThrow(() -> new ResourceNotFoundException("Casting call not found with ID: " + callId));
            application.setCastingCall(castingCall);
        }

        application.setApplicantName(request.getApplicantName());
        if (request.getApplicantEmail() != null) {
            application.setApplicantEmail(request.getApplicantEmail());
        } else if (request.getEmail() != null) {
            application.setApplicantEmail(request.getEmail());
        }

        if (request.getApplicantPhone() != null) {
            application.setApplicantPhone(request.getApplicantPhone());
        } else if (request.getPhone() != null) {
            application.setApplicantPhone(request.getPhone());
        }

        if (request.getPortfolioUrl() != null) {
            application.setPortfolioUrl(request.getPortfolioUrl());
        } else if (request.getTapeUrl() != null) {
            application.setPortfolioUrl(request.getTapeUrl());
        }

        application.setExperienceYears(request.getExperienceYears());
        application.setNotes(request.getNotes());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            application.setStatus(request.getStatus().toUpperCase());
        }

        if (request.getAuditionDate() != null) {
            application.setAuditionDate(request.getAuditionDate());
        }

        if (request.getAppliedRole() != null) {
            application.setAppliedRole(request.getAppliedRole());
        }
        if (request.getCity() != null) {
            application.setCity(request.getCity());
        }
        if (request.getRating() != null) {
            application.setRating(request.getRating());
        }

        CastingApplication updated = castingApplicationRepository.save(application);
        return mapToResponseDto(updated);
    }

    public CastingApplicationResponseDto updateStatus(Long id, ApplicationStatusUpdateDto statusDto, String statusParam) {
        CastingApplication application = castingApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Casting application not found with ID: " + id));

        String newStatus = null;
        LocalDateTime auditionDate = null;
        String notes = null;

        if (statusDto != null) {
            if (statusDto.getStatus() != null && !statusDto.getStatus().isBlank()) {
                newStatus = statusDto.getStatus();
            }
            if (statusDto.getAuditionDate() != null) {
                auditionDate = statusDto.getAuditionDate();
            }
            if (statusDto.getNotes() != null && !statusDto.getNotes().isBlank()) {
                notes = statusDto.getNotes();
            }
        }

        if (newStatus == null && statusParam != null && !statusParam.isBlank()) {
            newStatus = statusParam;
        }

        if (newStatus != null && !newStatus.isBlank()) {
            application.setStatus(newStatus.trim().toUpperCase());
        }
        if (auditionDate != null) {
            application.setAuditionDate(auditionDate);
        }
        if (notes != null) {
            application.setNotes(notes);
        }

        CastingApplication updated = castingApplicationRepository.save(application);
        return mapToResponseDto(updated);
    }

    public void deleteApplication(Long id) {
        if (!castingApplicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Casting application not found with ID: " + id);
        }
        castingApplicationRepository.deleteById(id);
    }

    public CastingApplicationResponseDto mapToResponseDto(CastingApplication application) {
        Long castingCallId = null;
        String castingCallTitle = null;
        if (application.getCastingCall() != null) {
            castingCallId = application.getCastingCall().getId();
            castingCallTitle = application.getCastingCall().getTitle();
        }

        CastingApplicationResponseDto dto = new CastingApplicationResponseDto(
                application.getId(),
                castingCallId,
                castingCallTitle,
                application.getApplicantName(),
                application.getApplicantEmail(),
                application.getApplicantPhone(),
                application.getPortfolioUrl(),
                application.getExperienceYears(),
                application.getNotes(),
                application.getStatus(),
                application.getAuditionDate(),
                application.getCreatedAt(),
                application.getUpdatedAt()
        );

        dto.setAppliedRole(application.getAppliedRole());
        dto.setCity(application.getCity());
        dto.setRating(application.getRating());

        return dto;
    }
}
