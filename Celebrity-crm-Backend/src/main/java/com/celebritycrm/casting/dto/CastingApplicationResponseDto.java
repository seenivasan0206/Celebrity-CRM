package com.celebritycrm.casting.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class CastingApplicationResponseDto {

    private Long id;
    private Long castingCallId;
    private String castingCallTitle;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String portfolioUrl;
    private Integer experienceYears;
    private String notes;
    private String status;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime auditionDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // Optional compatibility fields
    private String appliedRole;
    private String city;
    private Integer rating;

    public CastingApplicationResponseDto() {
    }

    public CastingApplicationResponseDto(Long id, Long castingCallId, String castingCallTitle,
                                         String applicantName, String applicantEmail, String applicantPhone,
                                         String portfolioUrl, Integer experienceYears, String notes,
                                         String status, LocalDateTime auditionDate,
                                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.castingCallId = castingCallId;
        this.castingCallTitle = castingCallTitle;
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.applicantPhone = applicantPhone;
        this.portfolioUrl = portfolioUrl;
        this.experienceYears = experienceYears;
        this.notes = notes;
        this.status = status;
        this.auditionDate = auditionDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCastingCallId() {
        return castingCallId;
    }

    public void setCastingCallId(Long castingCallId) {
        this.castingCallId = castingCallId;
    }

    public String getCastingCallTitle() {
        return castingCallTitle;
    }

    public void setCastingCallTitle(String castingCallTitle) {
        this.castingCallTitle = castingCallTitle;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getApplicantEmail() {
        return applicantEmail;
    }

    public void setApplicantEmail(String applicantEmail) {
        this.applicantEmail = applicantEmail;
    }

    public String getEmail() {
        return applicantEmail;
    }

    public String getApplicantPhone() {
        return applicantPhone;
    }

    public void setApplicantPhone(String applicantPhone) {
        this.applicantPhone = applicantPhone;
    }

    public String getPhone() {
        return applicantPhone;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public String getTapeUrl() {
        return portfolioUrl;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getExperience() {
        return experienceYears != null ? experienceYears + " Years" : null;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAuditionDate() {
        return auditionDate;
    }

    public void setAuditionDate(LocalDateTime auditionDate) {
        this.auditionDate = auditionDate;
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

    public String getAppliedRole() {
        return appliedRole;
    }

    public void setAppliedRole(String appliedRole) {
        this.appliedRole = appliedRole;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
}
