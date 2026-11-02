package com.celebritycrm.casting.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CastingCallResponseDto {

    private Long id;
    private String projectTitle;
    private String roleName;
    private String roleDescription;
    private Integer characterAgeMin;
    private Integer characterAgeMax;
    private String gender;
    private String location;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate deadline;

    private String status;
    private String compensation;
    private String contactEmail;
    private Integer applicationsCount;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    public CastingCallResponseDto() {
    }

    public CastingCallResponseDto(Long id, String projectTitle, String roleName, String roleDescription,
                                  Integer characterAgeMin, Integer characterAgeMax, String gender,
                                  String location, LocalDate deadline, String status,
                                  String compensation, String contactEmail, Integer applicationsCount,
                                  LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.projectTitle = projectTitle;
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.characterAgeMin = characterAgeMin;
        this.characterAgeMax = characterAgeMax;
        this.gender = gender;
        this.location = location;
        this.deadline = deadline;
        this.status = status;
        this.compensation = compensation;
        this.contactEmail = contactEmail;
        this.applicationsCount = applicationsCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getTitle() {
        if (projectTitle != null && roleName != null) {
            return projectTitle + " - " + roleName;
        }
        return projectTitle != null ? projectTitle : roleName;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRole() {
        return roleName;
    }

    public String getRoleDescription() {
        return roleDescription;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
    }

    public String getDescription() {
        return roleDescription;
    }

    public Integer getCharacterAgeMin() {
        return characterAgeMin;
    }

    public void setCharacterAgeMin(Integer characterAgeMin) {
        this.characterAgeMin = characterAgeMin;
    }

    public Integer getCharacterAgeMax() {
        return characterAgeMax;
    }

    public void setCharacterAgeMax(Integer characterAgeMax) {
        this.characterAgeMax = characterAgeMax;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCompensation() {
        return compensation;
    }

    public void setCompensation(String compensation) {
        this.compensation = compensation;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public Integer getApplicationsCount() {
        return applicationsCount;
    }

    public void setApplicationsCount(Integer applicationsCount) {
        this.applicationsCount = applicationsCount;
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
