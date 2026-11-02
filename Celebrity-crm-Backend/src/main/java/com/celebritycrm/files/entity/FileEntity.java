package com.celebritycrm.files.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "files")
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false, unique = true)
    private String fileName;

    @Column(name = "original_file_name", nullable = false)
    private String originalFileName;

    @Column(name = "file_download_uri", nullable = false)
    private String fileDownloadUri;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "size")
    private Long size;

    @Column(name = "description")
    private String description;

    @Column(name = "category")
    private String category;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    public FileEntity() {
    }

    public FileEntity(String fileName, String originalFileName, String fileDownloadUri, String fileType, Long size, String description, String category) {
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.fileDownloadUri = fileDownloadUri;
        this.fileType = fileType;
        this.size = size;
        this.description = description;
        this.category = category;
        this.uploadedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.uploadedAt == null) {
            this.uploadedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getFileDownloadUri() {
        return fileDownloadUri;
    }

    public void setFileDownloadUri(String fileDownloadUri) {
        this.fileDownloadUri = fileDownloadUri;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}

