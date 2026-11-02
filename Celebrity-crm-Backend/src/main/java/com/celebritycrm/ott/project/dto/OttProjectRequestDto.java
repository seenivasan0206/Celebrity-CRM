package com.celebritycrm.ott.project.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDate;

public class OttProjectRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Platform is required")
    private String platform;

    private String genre;
    private String status;
    private String director;
    private String producer;
    private BigDecimal budget;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonAlias({"expectedReleaseDate", "release_date"})
    private LocalDate releaseDate;
    private String expectedRelease;

    // Optional compatibility fields
    @JsonAlias({"celebrityName", "actor", "star"})
    private String leadStar;
    private Long celebrityId;
    @JsonAlias({"totalEpisodes", "episodeCount"})
    private Integer episodes;

    public OttProjectRequestDto() {
    }

    public OttProjectRequestDto(String title, String description, String platform, String genre,
                               String status, String director, String producer, BigDecimal budget,
                               LocalDate releaseDate) {
        this.title = title;
        this.description = description;
        this.platform = platform;
        this.genre = genre;
        this.status = status;
        this.director = director;
        this.producer = producer;
        this.budget = budget;
        this.releaseDate = releaseDate;
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
        return expectedRelease;
    }

    public void setExpectedRelease(String expectedRelease) {
        this.expectedRelease = expectedRelease;
    }
}
