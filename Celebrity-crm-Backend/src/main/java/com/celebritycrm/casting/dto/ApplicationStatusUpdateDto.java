package com.celebritycrm.casting.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class ApplicationStatusUpdateDto {

    @NotBlank(message = "Status is required")
    private String status;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime auditionDate;

    private String notes;

    public ApplicationStatusUpdateDto() {
    }

    public ApplicationStatusUpdateDto(String status) {
        this.status = status;
    }

    public ApplicationStatusUpdateDto(String status, LocalDateTime auditionDate) {
        this.status = status;
        this.auditionDate = auditionDate;
    }

    public ApplicationStatusUpdateDto(String status, LocalDateTime auditionDate, String notes) {
        this.status = status;
        this.auditionDate = auditionDate;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
