package com.celebritycrm.casting.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class CastingApplicationRequestDto {

    @NotNull(message = "Casting call ID is required")
    private Long castingCallId;

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @JsonAlias({"email"})
    private String applicantEmail;

    @JsonAlias({"phone"})
    private String applicantPhone;

    @JsonAlias({"tapeUrl", "videoUrl", "auditionReelUrl"})
    private String portfolioUrl;

    @JsonAlias({"experience"})
    private Integer experienceYears;

    private String notes;
    private String status;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime auditionDate;

    // Optional compatibility fields
    private String appliedRole;
    private String city;
    private Integer rating;

    public CastingApplicationRequestDto() {
    }

    public CastingApplicationRequestDto(Long castingCallId, String applicantName, String applicantEmail,
                                        String applicantPhone, String portfolioUrl, Integer experienceYears,
                                        String notes, String status, LocalDateTime auditionDate) {
        this.castingCallId = castingCallId;
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.applicantPhone = applicantPhone;
        this.portfolioUrl = portfolioUrl;
        this.experienceYears = experienceYears;
        this.notes = notes;
        this.status = status;
        this.auditionDate = auditionDate;
    }

    public Long getCastingCallId() {
        return castingCallId;
    }

    public void setCastingCallId(Long castingCallId) {
        this.castingCallId = castingCallId;
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

    public void setEmail(String email) {
        this.applicantEmail = email;
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

    public void setPhone(String phone) {
        this.applicantPhone = phone;
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

    public void setTapeUrl(String tapeUrl) {
        this.portfolioUrl = tapeUrl;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
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
