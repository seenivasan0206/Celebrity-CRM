package com.celebritycrm.agencies.service;

import com.celebritycrm.agencies.dto.AgencyRequest;
import com.celebritycrm.agencies.dto.AgencyResponse;
import com.celebritycrm.agencies.entity.Agency;
import com.celebritycrm.agencies.repository.AgencyRepository;
import com.celebritycrm.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AgencyService {

    private final AgencyRepository agencyRepository;

    public AgencyService(AgencyRepository agencyRepository) {
        this.agencyRepository = agencyRepository;
    }

    public AgencyResponse createAgency(AgencyRequest request) {
        String trimmedName = request.getName().trim();
        if (agencyRepository.existsByNameIgnoreCase(trimmedName)) {
            throw new IllegalArgumentException("Agency with name '" + trimmedName + "' already exists.");
        }

        Agency agency = new Agency();
        copyProperties(request, agency);

        Agency saved = agencyRepository.save(agency);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AgencyResponse> getAllAgencies(String status, String search) {
        List<Agency> agencies;

        if (StringUtils.hasText(search)) {
            String trimmedSearch = search.trim();
            agencies = agencyRepository.findByNameContainingIgnoreCaseOrCountryContainingIgnoreCase(trimmedSearch, trimmedSearch);
        } else if (StringUtils.hasText(status)) {
            agencies = agencyRepository.findByStatusIgnoreCase(status.trim());
        } else {
            agencies = agencyRepository.findAll();
        }

        return agencies.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AgencyResponse getAgencyById(Long id) {
        Agency agency = agencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found with ID: " + id));
        return mapToResponse(agency);
    }

    public AgencyResponse updateAgency(Long id, AgencyRequest request) {
        Agency agency = agencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found with ID: " + id));

        String trimmedName = request.getName().trim();
        if (!trimmedName.equalsIgnoreCase(agency.getName()) && agencyRepository.existsByNameIgnoreCase(trimmedName)) {
            throw new IllegalArgumentException("Agency with name '" + trimmedName + "' already exists.");
        }

        copyProperties(request, agency);
        Agency updated = agencyRepository.save(agency);
        return mapToResponse(updated);
    }

    public AgencyResponse updateStatus(Long id, String status) {
        Agency agency = agencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found with ID: " + id));

        if (!StringUtils.hasText(status)) {
            throw new IllegalArgumentException("Status cannot be empty");
        }

        agency.setStatus(status.trim().toUpperCase());
        Agency updated = agencyRepository.save(agency);
        return mapToResponse(updated);
    }

    public void deleteAgency(Long id) {
        if (!agencyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Agency not found with ID: " + id);
        }
        agencyRepository.deleteById(id);
    }

    private void copyProperties(AgencyRequest request, Agency agency) {
        agency.setName(request.getName().trim());
        agency.setEmail(StringUtils.hasText(request.getEmail()) ? request.getEmail().trim() : null);
        agency.setPhone(StringUtils.hasText(request.getPhone()) ? request.getPhone().trim() : null);
        agency.setWebsite(StringUtils.hasText(request.getWebsite()) ? request.getWebsite().trim() : null);
        agency.setAddress(StringUtils.hasText(request.getAddress()) ? request.getAddress().trim() : null);
        agency.setCountry(StringUtils.hasText(request.getCountry()) ? request.getCountry().trim() : null);
        agency.setCommissionRate(request.getCommissionRate());
        agency.setDescription(StringUtils.hasText(request.getDescription()) ? request.getDescription().trim() : null);

        if (StringUtils.hasText(request.getStatus())) {
            agency.setStatus(request.getStatus().trim().toUpperCase());
        } else if (!StringUtils.hasText(agency.getStatus())) {
            agency.setStatus("ACTIVE");
        }
    }

    public AgencyResponse mapToResponse(Agency agency) {
        AgencyResponse response = new AgencyResponse();
        response.setId(agency.getId());
        response.setName(agency.getName());
        response.setEmail(agency.getEmail());
        response.setPhone(agency.getPhone());
        response.setWebsite(agency.getWebsite());
        response.setAddress(agency.getAddress());
        response.setCountry(agency.getCountry());
        response.setCommissionRate(agency.getCommissionRate());
        response.setDescription(agency.getDescription());
        response.setStatus(agency.getStatus());
        response.setCreatedAt(agency.getCreatedAt());
        response.setUpdatedAt(agency.getUpdatedAt());
        return response;
    }
}
