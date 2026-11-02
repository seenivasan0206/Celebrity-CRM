package com.celebritycrm.reports.controller;

import com.celebritycrm.reports.dto.*;
import com.celebritycrm.reports.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardReportResponse> getDashboardReport() {
        return ResponseEntity.ok(reportService.getDashboardReport());
    }

    @GetMapping("/celebrities")
    public ResponseEntity<CelebrityReportResponse> getCelebrityReport() {
        return ResponseEntity.ok(reportService.getCelebrityReport());
    }

    @GetMapping("/agencies")
    public ResponseEntity<AgencyReportResponse> getAgencyReport() {
        return ResponseEntity.ok(reportService.getAgencyReport());
    }

    @GetMapping("/campaigns")
    public ResponseEntity<CampaignReportResponse> getCampaignReport() {
        return ResponseEntity.ok(reportService.getCampaignReport());
    }

    @GetMapping("/shoots")
    public ResponseEntity<ShootReportResponse> getShootReport() {
        return ResponseEntity.ok(reportService.getShootReport());
    }

    @GetMapping("/contracts")
    public ResponseEntity<ContractReportResponse> getContractReport() {
        return ResponseEntity.ok(reportService.getContractReport());
    }

    @GetMapping("/ott-projects")
    public ResponseEntity<OttProjectReportResponse> getOttProjectReport() {
        return ResponseEntity.ok(reportService.getOttProjectReport());
    }
}

