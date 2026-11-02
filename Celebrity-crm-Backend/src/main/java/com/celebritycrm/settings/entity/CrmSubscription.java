package com.celebritycrm.settings.entity;

import com.celebritycrm.user.entity.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "crm_subscriptions")
public class CrmSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "plan_name", nullable = false, length = 100)
    private String planName = "Zenve VIP Enterprise";

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE";

    @Column(name = "renewal_date")
    private LocalDate renewalDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CrmSubscription() {
    }

    public CrmSubscription(User user, String planName, String status, LocalDate renewalDate, String description) {
        this.user = user;
        this.planName = (planName != null && !planName.isBlank()) ? planName : "Zenve VIP Enterprise";
        this.status = (status != null && !status.isBlank()) ? status : "ACTIVE";
        this.renewalDate = (renewalDate != null) ? renewalDate : LocalDate.now().plusYears(1);
        this.description = description;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.planName == null || this.planName.isBlank()) {
            this.planName = "Zenve VIP Enterprise";
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "ACTIVE";
        }
        if (this.renewalDate == null) {
            this.renewalDate = LocalDate.now().plusYears(1);
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getRenewalDate() {
        return renewalDate;
    }

    public void setRenewalDate(LocalDate renewalDate) {
        this.renewalDate = renewalDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

