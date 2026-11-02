package com.celebritycrm.ott.project.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ott_projects")
public class OttProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 150)
    private String platform;

    @Column(length = 100)
    private String genre;

    @Column(nullable = false, length = 50)
    private String status = "IN_PRODUCTION";

    @Column(length = 150)
    private String director;

    @Column(length = 150)
    private String producer;

    @Column(precision = 15, scale = 2)
    private BigDecimal budget;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    // Optional legacy/alias fields
    @Column(name = "lead_star", length = 150)
    private String leadStar;

    @Column(name = "celebrity_id")
    private Long celebrityId;

    @Column(name = "episodes")
    private Integer episodes;

    @Column(name = "expected_release", length = 100)
    private String expectedRelease;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public OttProject() {
    }

    public OttProject(String title, String description, String platform, String genre,
                      String status, String director, String producer, BigDecimal budget,
                      LocalDate releaseDate) {
        this.title = title;
        this.description = description;
        this.platform = platform;
        this.genre = genre;
        this.status = (status != null && !status.isBlank()) ? status : "IN_PRODUCTION";
        this.director = director;
        this.producer = producer;
        this.budget = budget;
        this.releaseDate = releaseDate;
        this.expectedRelease = releaseDate != null ? releaseDate.toString() : null;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null || this.status.isBlank()) {
            this.status = "IN_PRODUCTION";
        }
        if (this.releaseDate != null && (this.expectedRelease == null || this.expectedRelease.isBlank())) {
            this.expectedRelease = this.releaseDate.toString();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.releaseDate != null && (this.expectedRelease == null || this.expectedRelease.isBlank())) {
            this.expectedRelease = this.releaseDate.toString();
        }
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getProducer() {
        return producer;
    }

    public void setProducer(String producer) {
        this.producer = producer;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
        if (this.expectedRelease == null) {
            this.expectedRelease = releaseDate != null ? releaseDate.toString() : null;
        }
    }

    public String getLeadStar() {
        return leadStar;
    }

    public void setLeadStar(String leadStar) {
        this.leadStar = leadStar;
    }

    public Long getCelebrityId() {
        return celebrityId;
    }

    public void setCelebrityId(Long celebrityId) {
        this.celebrityId = celebrityId;
    }

    public Integer getEpisodes() {
        return episodes;
    }

    public void setEpisodes(Integer episodes) {
        this.episodes = episodes;
    }

    public String getExpectedRelease() {
        return expectedRelease != null ? expectedRelease : (releaseDate != null ? releaseDate.toString() : null);
    }

    public void setExpectedRelease(String expectedRelease) {
        this.expectedRelease = expectedRelease;
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
