package com.celebritycrm.casting.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "casting_calls")
public class CastingCall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_title", nullable = false, length = 200)
    private String projectTitle;

    @Column(name = "role_name", length = 150)
    private String roleName;

    @Column(name = "role_description", columnDefinition = "TEXT")
    private String roleDescription;

    @Column(name = "character_age_min")
    private Integer characterAgeMin;

    @Column(name = "character_age_max")
    private Integer characterAgeMax;

    @Column(length = 50)
    private String gender;

    @Column(length = 150)
    private String location;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(nullable = false, length = 50)
    private String status = "OPEN";

    @Column(length = 100)
    private String compensation;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    // Optional legacy/alias fields
    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "age_group", length = 100)
    private String ageGroup;

    @Column(name = "requirements", columnDefinition = "TEXT")
    private String requirements;

    @OneToMany(mappedBy = "castingCall", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CastingApplication> applications = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CastingCall() {
    }

    public CastingCall(String projectTitle, String roleName, String roleDescription,
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
        this.status = (status != null && !status.isBlank()) ? status : "OPEN";
        this.compensation = compensation;
        this.contactEmail = contactEmail;
        this.title = (projectTitle != null ? projectTitle : "") + (roleName != null ? " - " + roleName : "");
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null || this.status.isBlank()) {
            this.status = "OPEN";
        }
        if (this.title == null || this.title.isBlank()) {
            this.title = (projectTitle != null ? projectTitle : "") + (roleName != null ? " - " + roleName : "");
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.title == null || this.title.isBlank()) {
            this.title = (projectTitle != null ? projectTitle : "") + (roleName != null ? " - " + roleName : "");
        }
    }

    public void addApplication(CastingApplication application) {
        applications.add(application);
        application.setCastingCall(this);
    }

    public void removeApplication(CastingApplication application) {
        applications.remove(application);
        application.setCastingCall(null);
    }

    // Getters and Setters

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

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleDescription() {
        return roleDescription;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
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

    public String getTitle() {
        if (title != null && !title.isBlank()) {
            return title;
        }
        return (projectTitle != null ? projectTitle : "") + (roleName != null ? " - " + roleName : "");
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getRole() {
        return roleName;
    }

    public void setRole(String role) {
        this.roleName = role;
    }

    public String getDescription() {
        return roleDescription;
    }

    public void setDescription(String description) {
        this.roleDescription = description;
    }

    public List<CastingApplication> getApplications() {
        return applications;
    }

    public void setApplications(List<CastingApplication> applications) {
        this.applications = applications;
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
