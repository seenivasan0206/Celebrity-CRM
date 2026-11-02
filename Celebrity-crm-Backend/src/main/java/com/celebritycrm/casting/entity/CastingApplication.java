package com.celebritycrm.casting.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "casting_applications")
public class CastingApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "casting_call_id", nullable = false)
    private CastingCall castingCall;

    @Column(name = "applicant_name", nullable = false, length = 150)
    private String applicantName;

    @Column(name = "applicant_email", length = 150)
    private String applicantEmail;

    @Column(name = "applicant_phone", length = 50)
    private String applicantPhone;

    @Column(name = "portfolio_url", length = 500)
    private String portfolioUrl;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false, length = 50)
    private String status = "SUBMITTED";

    @Column(name = "audition_date")
    private LocalDateTime auditionDate;

    // Optional legacy/alias fields
    @Column(name = "applied_role", length = 150)
    private String appliedRole;

    @Column(length = 100)
    private String city;

    @Column(name = "tape_url", length = 500)
    private String tapeUrl;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CastingApplication() {
    }

    public CastingApplication(CastingCall castingCall, String applicantName, String applicantEmail,
                              String applicantPhone, String portfolioUrl, Integer experienceYears,
                              String notes, String status, LocalDateTime auditionDate) {
        this.castingCall = castingCall;
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.applicantPhone = applicantPhone;
        this.portfolioUrl = portfolioUrl;
        this.experienceYears = experienceYears;
        this.notes = notes;
        this.status = (status != null && !status.isBlank()) ? status : "SUBMITTED";
        this.auditionDate = auditionDate;
        this.tapeUrl = portfolioUrl;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null || this.status.isBlank()) {
            this.status = "SUBMITTED";
        }
        if (this.portfolioUrl != null && this.tapeUrl == null) {
            this.tapeUrl = this.portfolioUrl;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CastingCall getCastingCall() {
        return castingCall;
    }

    public void setCastingCall(CastingCall castingCall) {
        this.castingCall = castingCall;
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
        if (this.tapeUrl == null) {
            this.tapeUrl = portfolioUrl;
        }
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

    public String getTapeUrl() {
        return tapeUrl;
    }

    public void setTapeUrl(String tapeUrl) {
        this.tapeUrl = tapeUrl;
        if (this.portfolioUrl == null) {
            this.portfolioUrl = tapeUrl;
        }
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
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
