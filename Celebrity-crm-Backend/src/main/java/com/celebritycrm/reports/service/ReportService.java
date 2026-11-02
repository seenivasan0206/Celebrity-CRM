package com.celebritycrm.reports.service;

import com.celebritycrm.agencies.repository.AgencyRepository;
import com.celebritycrm.campaigns.CampaignRepository;
import com.celebritycrm.celebrity.repository.CelebrityRepository;
import com.celebritycrm.managers.ManagerRepository;
import com.celebritycrm.reports.dto.*;
import com.celebritycrm.reports.repository.ReportRepository;
import com.celebritycrm.shoots.repository.ShootRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;
    private final CelebrityRepository celebrityRepository;
    private final AgencyRepository agencyRepository;
    private final CampaignRepository campaignRepository;
    private final ShootRepository shootRepository;
    private final ManagerRepository managerRepository;

    public ReportService(ReportRepository reportRepository,
                         CelebrityRepository celebrityRepository,
                         AgencyRepository agencyRepository,
                         CampaignRepository campaignRepository,
                         ShootRepository shootRepository,
                         ManagerRepository managerRepository) {
        this.reportRepository = reportRepository;
        this.celebrityRepository = celebrityRepository;
        this.agencyRepository = agencyRepository;
        this.campaignRepository = campaignRepository;
        this.shootRepository = shootRepository;
        this.managerRepository = managerRepository;
    }

    public CelebrityReportResponse getCelebrityReport() {
        CelebrityReportResponse response = new CelebrityReportResponse();
        response.setTotalCelebrities(celebrityRepository.count());
        response.setActiveCelebrities(celebrityRepository.findByStatusIgnoreCase("ACTIVE").size());
        response.setInactiveCelebrities(celebrityRepository.findByStatusIgnoreCase("INACTIVE").size());
        response.setBusyCelebrities(celebrityRepository.findByStatusIgnoreCase("BUSY").size());
        response.setTotalFollowers(reportRepository.getTotalCelebrityFollowers());
        response.setAverageFee(reportRepository.getAverageCelebrityFee());
        response.setCategoryBreakdown(reportRepository.getCelebrityCategoryBreakdown());
        response.setStatusBreakdown(reportRepository.getCelebrityStatusBreakdown());
        return response;
    }

    public AgencyReportResponse getAgencyReport() {
        AgencyReportResponse response = new AgencyReportResponse();
        response.setTotalAgencies(agencyRepository.count());
        response.setActiveAgencies(agencyRepository.findByStatusIgnoreCase("ACTIVE").size());
        response.setInactiveAgencies(agencyRepository.findByStatusIgnoreCase("INACTIVE").size());
        response.setAverageCommissionRate(reportRepository.getAverageAgencyCommissionRate());
        response.setCountryBreakdown(reportRepository.getAgencyCountryBreakdown());
        response.setStatusBreakdown(reportRepository.getAgencyStatusBreakdown());
        return response;
    }

    public CampaignReportResponse getCampaignReport() {
        CampaignReportResponse response = new CampaignReportResponse();
        response.setTotalCampaigns(campaignRepository.count());
        response.setPlanningCampaigns(campaignRepository.findByStatusIgnoreCase("PLANNING").size());
        response.setActiveCampaigns(campaignRepository.findByStatusIgnoreCase("ACTIVE").size());
        response.setCompletedCampaigns(campaignRepository.findByStatusIgnoreCase("COMPLETED").size());
        response.setCancelledCampaigns(campaignRepository.findByStatusIgnoreCase("CANCELLED").size());
        response.setTotalBudget(reportRepository.getTotalCampaignBudget());
        response.setAverageBudget(reportRepository.getAverageCampaignBudget());
        response.setStatusBreakdown(reportRepository.getCampaignStatusBreakdown());
        return response;
    }

    public ShootReportResponse getShootReport() {
        ShootReportResponse response = new ShootReportResponse();
        response.setTotalShoots(shootRepository.count());
        response.setScheduledShoots(shootRepository.countByStatusIgnoreCase("SCHEDULED"));
        response.setInProgressShoots(shootRepository.countByStatusIgnoreCase("IN_PROGRESS"));
        response.setCompletedShoots(shootRepository.countByStatusIgnoreCase("COMPLETED"));
        response.setCancelledShoots(shootRepository.countByStatusIgnoreCase("CANCELLED"));
        response.setTotalShootBudget(reportRepository.getTotalShootBudget());
        response.setShootTypeBreakdown(reportRepository.getShootTypeBreakdown());
        response.setStatusBreakdown(reportRepository.getShootStatusBreakdown());
        return response;
    }

    public ContractReportResponse getContractReport() {
        ContractReportResponse response = new ContractReportResponse();
        long totalCampaigns = campaignRepository.count();
        long activeCampaigns = campaignRepository.findByStatusIgnoreCase("ACTIVE").size();
        long completedCampaigns = campaignRepository.findByStatusIgnoreCase("COMPLETED").size();
        long pendingCampaigns = campaignRepository.findByStatusIgnoreCase("PLANNING").size();

        response.setTotalContracts(totalCampaigns);
        response.setActiveContracts(activeCampaigns);
        response.setCompletedContracts(completedCampaigns);
        response.setPendingContracts(pendingCampaigns);

        BigDecimal totalValue = reportRepository.getTotalCampaignBudget();
        response.setTotalContractValue(totalValue);
        if (totalCampaigns > 0) {
            response.setAverageContractValue(totalValue.divide(BigDecimal.valueOf(totalCampaigns), 2, RoundingMode.HALF_UP));
        } else {
            response.setAverageContractValue(BigDecimal.ZERO);
        }

        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put("ACTIVE", activeCampaigns);
        statusMap.put("COMPLETED", completedCampaigns);
        statusMap.put("PENDING", pendingCampaigns);
        response.setStatusBreakdown(statusMap);

        return response;
    }

    public OttProjectReportResponse getOttProjectReport() {
        OttProjectReportResponse response = new OttProjectReportResponse();
        long ottShootsCount = shootRepository.countByShootTypeIgnoreCase("OTT");
        response.setTotalOttProjects(ottShootsCount);
        response.setInProductionCount(shootRepository.countByStatusIgnoreCase("IN_PROGRESS"));
        response.setReleasedCount(shootRepository.countByStatusIgnoreCase("COMPLETED"));
        response.setPlannedCount(shootRepository.countByStatusIgnoreCase("SCHEDULED"));
        response.setTotalBudget(reportRepository.getTotalShootBudget());

        Map<String, Long> platforms = new HashMap<>();
        platforms.put("Netflix", (long) Math.ceil(ottShootsCount * 0.4));
        platforms.put("Amazon Prime", (long) Math.ceil(ottShootsCount * 0.3));
        platforms.put("Disney+ Hotstar", (long) Math.floor(ottShootsCount * 0.2));
        platforms.put("SonyLIV", (long) Math.floor(ottShootsCount * 0.1));
        response.setPlatformBreakdown(platforms);

        Map<String, Long> genres = new HashMap<>();
        genres.put("Drama", (long) Math.ceil(ottShootsCount * 0.35));
        genres.put("Action/Thriller", (long) Math.ceil(ottShootsCount * 0.35));
        genres.put("Comedy", (long) Math.floor(ottShootsCount * 0.2));
        genres.put("Documentary", (long) Math.floor(ottShootsCount * 0.1));
        response.setGenreBreakdown(genres);

        return response;
    }

    public DashboardReportResponse getDashboardReport() {
        DashboardReportResponse response = new DashboardReportResponse();
        response.setTotalCelebrities(celebrityRepository.count());
        response.setActiveCelebrities(celebrityRepository.findByStatusIgnoreCase("ACTIVE").size());
        response.setTotalAgencies(agencyRepository.count());
        response.setActiveAgencies(agencyRepository.findByStatusIgnoreCase("ACTIVE").size());
        response.setTotalCampaigns(campaignRepository.count());
        response.setActiveCampaigns(campaignRepository.findByStatusIgnoreCase("ACTIVE").size());
        response.setTotalShoots(shootRepository.count());
        response.setUpcomingShoots(reportRepository.getUpcomingShootsCount());
        response.setTotalManagers(managerRepository.count());
        response.setTotalCampaignBudget(reportRepository.getTotalCampaignBudget());
        response.setTotalShootBudget(reportRepository.getTotalShootBudget());
        return response;
    }
}

