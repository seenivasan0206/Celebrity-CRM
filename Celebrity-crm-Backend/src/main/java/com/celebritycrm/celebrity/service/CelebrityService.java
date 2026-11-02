package com.celebritycrm.celebrity.service;

import com.celebritycrm.celebrity.dto.CelebrityRequest;
import com.celebritycrm.celebrity.dto.CelebrityResponse;
import com.celebritycrm.celebrity.entity.Celebrity;
import com.celebritycrm.celebrity.repository.CelebrityRepository;
import com.celebritycrm.common.ResourceNotFoundException;
import com.celebritycrm.managers.Manager;
import com.celebritycrm.managers.ManagerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class CelebrityService {

    private final CelebrityRepository celebrityRepository;
    private final ManagerRepository managerRepository;

    public CelebrityService(CelebrityRepository celebrityRepository, ManagerRepository managerRepository) {
        this.celebrityRepository = celebrityRepository;
        this.managerRepository = managerRepository;
    }

    public CelebrityResponse createCelebrity(CelebrityRequest request) {
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (celebrityRepository.existsByEmail(request.getEmail().trim())) {
                throw new IllegalArgumentException("Celebrity already registered with email: " + request.getEmail());
            }
        }

        Celebrity celebrity = new Celebrity();
        copyProperties(request, celebrity);

        Celebrity saved = celebrityRepository.save(celebrity);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CelebrityResponse> getAllCelebrities(String category, String status, String search) {
        List<Celebrity> list;

        if (search != null && !search.isBlank()) {
            String trimmedSearch = search.trim();
            list = celebrityRepository.findByNameContainingIgnoreCaseOrStageNameContainingIgnoreCase(trimmedSearch, trimmedSearch);
        } else if (category != null && !category.isBlank() && status != null && !status.isBlank()) {
            list = celebrityRepository.findByCategoryIgnoreCaseAndStatusIgnoreCase(category.trim(), status.trim());
        } else if (category != null && !category.isBlank()) {
            list = celebrityRepository.findByCategoryIgnoreCase(category.trim());
        } else if (status != null && !status.isBlank()) {
            list = celebrityRepository.findByStatusIgnoreCase(status.trim());
        } else {
            list = celebrityRepository.findAll();
        }

        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CelebrityResponse getCelebrityById(Long id) {
        Celebrity celebrity = celebrityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Celebrity not found with ID: " + id));
        return mapToResponse(celebrity);
    }

    @Transactional(readOnly = true)
    public List<CelebrityResponse> getCelebritiesByManager(Long managerId) {
        if (!managerRepository.existsById(managerId)) {
            throw new ResourceNotFoundException("Manager not found with ID: " + managerId);
        }
        return celebrityRepository.findByManagerId(managerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CelebrityResponse updateCelebrity(Long id, CelebrityRequest request) {
        Celebrity celebrity = celebrityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Celebrity not found with ID: " + id));

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String newEmail = request.getEmail().trim();
            if (!newEmail.equalsIgnoreCase(celebrity.getEmail()) && celebrityRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("Email " + newEmail + " is already in use by another celebrity.");
            }
        }

        copyProperties(request, celebrity);
        Celebrity updated = celebrityRepository.save(celebrity);
        return mapToResponse(updated);
    }

    public CelebrityResponse updateStatus(Long id, String status) {
        Celebrity celebrity = celebrityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Celebrity not found with ID: " + id));

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }

        celebrity.setStatus(status.trim().toUpperCase());
        Celebrity updated = celebrityRepository.save(celebrity);
        return mapToResponse(updated);
    }

    public void deleteCelebrity(Long id) {
        if (!celebrityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Celebrity not found with ID: " + id);
        }
        celebrityRepository.deleteById(id);
    }

    private void copyProperties(CelebrityRequest request, Celebrity celebrity) {
        celebrity.setName(request.getName().trim());
        celebrity.setStageName(request.getStageName() != null ? request.getStageName().trim() : null);
        celebrity.setCategory(request.getCategory().trim().toUpperCase());
        celebrity.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        celebrity.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        celebrity.setGender(request.getGender() != null ? request.getGender().trim() : null);
        celebrity.setBio(request.getBio());
        celebrity.setSocialMediaHandle(request.getSocialMediaHandle() != null ? request.getSocialMediaHandle().trim() : null);
        celebrity.setFollowersCount(request.getFollowersCount());
        celebrity.setStandardFee(request.getStandardFee());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            celebrity.setStatus(request.getStatus().trim().toUpperCase());
        }

        if (request.getManagerId() != null) {
            Long managerId = Objects.requireNonNull(request.getManagerId());
            Manager manager = managerRepository.findById(managerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + managerId));
            celebrity.setManager(manager);
        } else {
            celebrity.setManager(null);
        }
    }

    public CelebrityResponse mapToResponse(Celebrity celebrity) {
        CelebrityResponse response = new CelebrityResponse();
        response.setId(celebrity.getId());
        response.setName(celebrity.getName());
        response.setStageName(celebrity.getStageName());
        response.setCategory(celebrity.getCategory());
        response.setEmail(celebrity.getEmail());
        response.setPhone(celebrity.getPhone());
        response.setGender(celebrity.getGender());
        response.setBio(celebrity.getBio());
        response.setSocialMediaHandle(celebrity.getSocialMediaHandle());
        response.setFollowersCount(celebrity.getFollowersCount());
        response.setStandardFee(celebrity.getStandardFee());
        response.setStatus(celebrity.getStatus());

        if (celebrity.getManager() != null) {
            response.setManagerId(celebrity.getManager().getId());
            response.setManagerName(celebrity.getManager().getName());
        }

        response.setCreatedAt(celebrity.getCreatedAt());
        response.setUpdatedAt(celebrity.getUpdatedAt());
        return response;
    }
}

