package com.celebritycrm.agencies.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class AgencyRequest {

    @NotBlank(message = "Agency name is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    private String name;

    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @Size(max = 50, message = "Phone must not exceed 50 characters")
    private String phone;

    @Size(max = 200, message = "Website URL must not exceed 200 characters")
    private String website;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    @DecimalMin(value = "0.00", message = "Commission rate cannot be negative")
    @DecimalMax(value = "100.00", message = "Commission rate cannot exceed 100%")
    private BigDecimal commissionRate;

    private String description;

    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String status;

    public AgencyRequest() {
    }

    public AgencyRequest(String name, String email, String phone, String website,
                         String address, String country, BigDecimal commissionRate,
                         String description, String status) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.website = website;
        this.address = address;
        this.country = country;
        this.commissionRate = commissionRate;
        this.description = description;
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public BigDecimal getCommissionRate() {
        return commissionRate;
    }

    public void setCommissionRate(BigDecimal commissionRate) {
        this.commissionRate = commissionRate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

