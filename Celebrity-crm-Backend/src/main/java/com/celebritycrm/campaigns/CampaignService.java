package com.celebritycrm.campaigns;

import com.celebritycrm.campaigns.dto.CampaignRequest;
import com.celebritycrm.campaigns.dto.CampaignResponse;
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
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final ManagerRepository managerRepository;

    public CampaignService(CampaignRepository campaignRepository, ManagerRepository managerRepository) {
        this.campaignRepository = campaignRepository;
        this.managerRepository = managerRepository;
    }

    public CampaignResponse createCampaign(CampaignRequest request) {
        Campaign campaign = new Campaign();
        campaign.setName(request.getName());
        campaign.setBrand(request.getBrand());
        campaign.setBudget(request.getBudget());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            campaign.setStatus(request.getStatus().toUpperCase());
        }
        campaign.setDescription(request.getDescription());

        if (request.getManagerId() != null) {
            Long managerId = Objects.requireNonNull(request.getManagerId());
            Manager manager = managerRepository.findById(managerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + managerId));
            campaign.setManager(manager);
        }

        Campaign saved = campaignRepository.save(campaign);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CampaignResponse> getAllCampaigns(String status) {
        List<Campaign> campaigns;
        if (status != null && !status.isBlank()) {
            campaigns = campaignRepository.findByStatusIgnoreCase(status);
        } else {
            campaigns = campaignRepository.findAll();
        }
        return campaigns.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CampaignResponse getCampaignById(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID: " + id));
        return mapToResponse(campaign);
    }

    @Transactional(readOnly = true)
    public List<CampaignResponse> getCampaignsByManager(Long managerId) {
        if (!managerRepository.existsById(managerId)) {
            throw new ResourceNotFoundException("Manager not found with ID: " + managerId);
        }
        return campaignRepository.findByManagerId(managerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CampaignResponse updateCampaign(Long id, CampaignRequest request) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID: " + id));

        campaign.setName(request.getName());
        campaign.setBrand(request.getBrand());
        campaign.setBudget(request.getBudget());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            campaign.setStatus(request.getStatus().toUpperCase());
        }
        campaign.setDescription(request.getDescription());

        if (request.getManagerId() != null) {
            Long managerId = Objects.requireNonNull(request.getManagerId());
            Manager manager = managerRepository.findById(managerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + managerId));
            campaign.setManager(manager);
        } else {
            campaign.setManager(null);
        }

        Campaign updated = campaignRepository.save(campaign);
        return mapToResponse(updated);
    }

    public CampaignResponse updateStatus(Long id, String status) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID: " + id));
        campaign.setStatus(status.toUpperCase());
        Campaign updated = campaignRepository.save(campaign);
        return mapToResponse(updated);
    }

    public void deleteCampaign(Long id) {
        if (!campaignRepository.existsById(id)) {
            throw new ResourceNotFoundException("Campaign not found with ID: " + id);
        }
        campaignRepository.deleteById(id);
    }

    public CampaignResponse mapToResponse(Campaign campaign) {
        CampaignResponse response = new CampaignResponse();
        response.setId(campaign.getId());
        response.setName(campaign.getName());
        response.setBrand(campaign.getBrand());
        response.setBudget(campaign.getBudget());
        response.setStartDate(campaign.getStartDate());
        response.setEndDate(campaign.getEndDate());
        response.setStatus(campaign.getStatus());
        response.setDescription(campaign.getDescription());
        if (campaign.getManager() != null) {
            response.setManagerId(campaign.getManager().getId());
            response.setManagerName(campaign.getManager().getName());
        }
        response.setCreatedAt(campaign.getCreatedAt());
        response.setUpdatedAt(campaign.getUpdatedAt());
        return response;
    }
}
