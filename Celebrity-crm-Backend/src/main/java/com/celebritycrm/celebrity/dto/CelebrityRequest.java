package com.celebritycrm.celebrity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class CelebrityRequest {

    @NotBlank(message = "Celebrity name is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    private String name;

    @Size(max = 150, message = "Stage name must not exceed 150 characters")
    private String stageName;

    @NotBlank(message = "Category is required (e.g. Actor, Singer, Athlete, Influencer)")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @Size(max = 50, message = "Phone must not exceed 50 characters")
    private String phone;

    @Size(max = 30, message = "Gender must not exceed 30 characters")
    private String gender;

    private String bio;

    @Size(max = 100, message = "Social media handle must not exceed 100 characters")
    private String socialMediaHandle;

    @PositiveOrZero(message = "Followers count must be zero or a positive number")
    private Long followersCount;

    @PositiveOrZero(message = "Standard fee must be zero or a positive amount")
    private BigDecimal standardFee;

    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String status;

    private Long managerId;

    public CelebrityRequest() {
    }

    public CelebrityRequest(String name, String stageName, String category, String email,
                            String phone, String gender, String bio, String socialMediaHandle,
                            Long followersCount, BigDecimal standardFee, String status, Long managerId) {
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
        this.status = status;
        this.managerId = managerId;
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

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }
}

