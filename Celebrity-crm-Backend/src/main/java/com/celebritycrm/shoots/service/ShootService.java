package com.celebritycrm.shoots.service;

import com.celebritycrm.campaigns.Campaign;
import com.celebritycrm.campaigns.CampaignRepository;
import com.celebritycrm.celebrity.entity.Celebrity;
import com.celebritycrm.celebrity.repository.CelebrityRepository;
import com.celebritycrm.common.ResourceNotFoundException;
import com.celebritycrm.shoots.dto.ShootRequest;
import com.celebritycrm.shoots.dto.ShootResponse;
import com.celebritycrm.shoots.entity.Shoot;
import com.celebritycrm.shoots.repository.ShootRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShootService {

    private final ShootRepository shootRepository;
    private final CelebrityRepository celebrityRepository;
    private final CampaignRepository campaignRepository;

    public ShootService(ShootRepository shootRepository,
                        CelebrityRepository celebrityRepository,
                        CampaignRepository campaignRepository) {
        this.shootRepository = shootRepository;
        this.celebrityRepository = celebrityRepository;
        this.campaignRepository = campaignRepository;
    }

    public ShootResponse createShoot(ShootRequest request) {
        Shoot shoot = new Shoot();
        copyProperties(request, shoot);

        Shoot saved = shootRepository.save(shoot);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ShootResponse> getAllShoots(String shootType, String status, Long celebrityId, Long campaignId, String search) {
        List<Shoot> shoots;

        if (celebrityId != null) {
            shoots = shootRepository.findByCelebrityId(celebrityId);
        } else if (campaignId != null) {
            shoots = shootRepository.findByCampaignId(campaignId);
        } else if (StringUtils.hasText(search)) {
            String trimmedSearch = search.trim();
            shoots = shootRepository.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(trimmedSearch, trimmedSearch);
        } else if (StringUtils.hasText(shootType)) {
            shoots = shootRepository.findByShootTypeIgnoreCase(shootType.trim());
        } else if (StringUtils.hasText(status)) {
            shoots = shootRepository.findByStatusIgnoreCase(status.trim());
        } else {
            shoots = shootRepository.findAll();
        }

        return shoots.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ShootResponse getShootById(Long id) {
        Shoot shoot = shootRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shoot not found with ID: " + id));
        return mapToResponse(shoot);
    }

    @Transactional(readOnly = true)
    public List<ShootResponse> getShootsByCelebrity(Long celebrityId) {
        if (!celebrityRepository.existsById(celebrityId)) {
            throw new ResourceNotFoundException("Celebrity not found with ID: " + celebrityId);
        }
        return shootRepository.findByCelebrityId(celebrityId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ShootResponse> getShootsByCampaign(Long campaignId) {
        if (!campaignRepository.existsById(campaignId)) {
            throw new ResourceNotFoundException("Campaign not found with ID: " + campaignId);
        }
        return shootRepository.findByCampaignId(campaignId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ShootResponse updateShoot(Long id, ShootRequest request) {
        Shoot shoot = shootRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shoot not found with ID: " + id));

        copyProperties(request, shoot);
        Shoot updated = shootRepository.save(shoot);
        return mapToResponse(updated);
    }

    public ShootResponse updateStatus(Long id, String status) {
        Shoot shoot = shootRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shoot not found with ID: " + id));

        if (!StringUtils.hasText(status)) {
            throw new IllegalArgumentException("Status cannot be empty");
        }

        shoot.setStatus(status.trim().toUpperCase());
        Shoot updated = shootRepository.save(shoot);
        return mapToResponse(updated);
    }

    public void deleteShoot(Long id) {
        if (!shootRepository.existsById(id)) {
            throw new ResourceNotFoundException("Shoot not found with ID: " + id);
        }
        shootRepository.deleteById(id);
    }

    private void copyProperties(ShootRequest request, Shoot shoot) {
        shoot.setTitle(request.getTitle().trim());
        shoot.setShootType(request.getShootType().trim().toUpperCase());
        shoot.setLocation(StringUtils.hasText(request.getLocation()) ? request.getLocation().trim() : null);
        shoot.setShootDate(request.getShootDate());
        shoot.setStartTime(request.getStartTime());
        shoot.setEndTime(request.getEndTime());
        shoot.setBudget(request.getBudget());
        shoot.setNotes(StringUtils.hasText(request.getNotes()) ? request.getNotes().trim() : null);

        if (StringUtils.hasText(request.getStatus())) {
            shoot.setStatus(request.getStatus().trim().toUpperCase());
        } else if (!StringUtils.hasText(shoot.getStatus())) {
            shoot.setStatus("SCHEDULED");
        }

        if (request.getCelebrityId() != null) {
            Long celebId = Objects.requireNonNull(request.getCelebrityId());
            Celebrity celebrity = celebrityRepository.findById(celebId)
                    .orElseThrow(() -> new ResourceNotFoundException("Celebrity not found with ID: " + celebId));
            shoot.setCelebrity(celebrity);
        } else {
            shoot.setCelebrity(null);
        }

        if (request.getCampaignId() != null) {
            Long campId = Objects.requireNonNull(request.getCampaignId());
            Campaign campaign = campaignRepository.findById(campId)
                    .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID: " + campId));
            shoot.setCampaign(campaign);
        } else {
            shoot.setCampaign(null);
        }
    }

    public ShootResponse mapToResponse(Shoot shoot) {
        ShootResponse response = new ShootResponse();
        response.setId(shoot.getId());
        response.setTitle(shoot.getTitle());
        response.setShootType(shoot.getShootType());
        response.setLocation(shoot.getLocation());
        response.setShootDate(shoot.getShootDate());
        response.setStartTime(shoot.getStartTime());
        response.setEndTime(shoot.getEndTime());
        response.setBudget(shoot.getBudget());
        response.setStatus(shoot.getStatus());
        response.setNotes(shoot.getNotes());

        if (shoot.getCelebrity() != null) {
            response.setCelebrityId(shoot.getCelebrity().getId());
            response.setCelebrityName(shoot.getCelebrity().getName());
        }

        if (shoot.getCampaign() != null) {
            response.setCampaignId(shoot.getCampaign().getId());
            response.setCampaignName(shoot.getCampaign().getName());
        }

        response.setCreatedAt(shoot.getCreatedAt());
        response.setUpdatedAt(shoot.getUpdatedAt());
        return response;
    }
}

