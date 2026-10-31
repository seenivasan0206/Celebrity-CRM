package com.celebritycrm.contracts.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ContractResponse {

    private Long id;
    private String contractNumber;
    private String title;
    private Long celebrityId;
    private String celebrityName;
    private String clientName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalValue;
    private String status;
    private String terms;
    private Long managerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ContractResponse() {
    }

    public ContractResponse(Long id, String contractNumber, String title, Long celebrityId, String celebrityName, String clientName, LocalDate startDate, LocalDate endDate, BigDecimal totalValue, String status, String terms, Long managerId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.contractNumber = contractNumber;
        this.title = title;
        this.celebrityId = celebrityId;
        this.celebrityName = celebrityName;
        this.clientName = clientName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalValue = totalValue;
        this.status = status;
        this.terms = terms;
        this.managerId = managerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContractNumber() {
        return contractNumber;
    }

    public void setContractNumber(String contractNumber) {
        this.contractNumber = contractNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getCelebrityId() {
        return celebrityId;
    }

    public void setCelebrityId(Long celebrityId) {
        this.celebrityId = celebrityId;
    }

    public String getCelebrityName() {
        return celebrityName;
    }

    public void setCelebrityName(String celebrityName) {
        this.celebrityName = celebrityName;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(BigDecimal totalValue) {
        this.totalValue = totalValue;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTerms() {
        return terms;
    }

    public void setTerms(String terms) {
        this.terms = terms;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

