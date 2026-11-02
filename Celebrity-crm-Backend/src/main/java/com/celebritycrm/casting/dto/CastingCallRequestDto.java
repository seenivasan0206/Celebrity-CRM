package com.celebritycrm.casting.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class CastingCallRequestDto {

    @NotBlank(message = "Project title is required")
    @JsonAlias({"title"})
    private String projectTitle;

    @JsonAlias({"role", "characterRole"})
    private String roleName;

    @JsonAlias({"description", "roleDesc"})
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

    // Optional compatibility field
    private String ageGroup;
    private String requirements;

    public CastingCallRequestDto() {
    }

    public CastingCallRequestDto(String projectTitle, String roleName, String roleDescription,
                                 Integer characterAgeMin, Integer characterAgeMax, String gender,
                                 String location, LocalDate deadline, String status,
                                 String compensation, String contactEmail) {
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
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getTitle() {
        return projectTitle;
    }

    public void setTitle(String title) {
        if (this.projectTitle == null || this.projectTitle.isBlank()) {
            this.projectTitle = title;
        }
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

    public void setRole(String role) {
        this.roleName = role;
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

    public void setDescription(String description) {
        this.roleDescription = description;
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

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }
}
