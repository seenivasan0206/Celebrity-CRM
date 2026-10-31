package com.celebritycrm.celebrity.entity;

import com.celebritycrm.managers.Manager;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "celebrities")
public class Celebrity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "stage_name", length = 150)
    private String stageName;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(length = 150)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(length = 30)
    private String gender;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "social_media_handle", length = 100)
    private String socialMediaHandle;

    @Column(name = "followers_count")
    private Long followersCount;

    @Column(name = "standard_fee", precision = 15, scale = 2)
    private BigDecimal standardFee;

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Manager manager;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Celebrity() {
    }

    public Celebrity(String name, String stageName, String category, String email, String phone,
                     String gender, String bio, String socialMediaHandle, Long followersCount,
                     BigDecimal standardFee, String status, Manager manager) {
        this.name = name;
        this.stageName = stageName;
        this.category = category;
        this.email = email;
        this.phone = phone;
        this.gender = gender;
        this.bio = bio;
        this.socialMediaHandle = socialMediaHandle;
        this.followersCount = followersCount;
        this.standardFee = standardFee;
        this.status = (status != null && !status.isBlank()) ? status : "ACTIVE";
        this.manager = manager;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null || this.status.isBlank()) {
            this.status = "ACTIVE";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStageName() {
        return stageName;
    }

    public void setStageName(String stageName) {
        this.stageName = stageName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSocialMediaHandle() {
        return socialMediaHandle;
    }

    public void setSocialMediaHandle(String socialMediaHandle) {
        this.socialMediaHandle = socialMediaHandle;
    }

    public Long getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(Long followersCount) {
        this.followersCount = followersCount;
    }

    public BigDecimal getStandardFee() {
        return standardFee;
    }

    public void setStandardFee(BigDecimal standardFee) {
        this.standardFee = standardFee;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
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

