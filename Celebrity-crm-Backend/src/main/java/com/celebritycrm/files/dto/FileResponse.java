package com.celebritycrm.files.dto;

import com.celebritycrm.files.entity.FileEntity;
import java.time.LocalDateTime;

public class FileResponse {

    private Long id;
    private String fileName;
    private String originalFileName;
    private String fileDownloadUri;
    private String fileType;
    private long size;
    private String description;
    private String category;
    private LocalDateTime uploadedAt;

    public FileResponse() {
    }

    public FileResponse(Long id, String fileName, String originalFileName, String fileDownloadUri, String fileType, long size, String description, String category, LocalDateTime uploadedAt) {
        this.id = id;
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.fileDownloadUri = fileDownloadUri;
        this.fileType = fileType;
        this.size = size;
        this.description = description;
        this.category = category;
        this.uploadedAt = uploadedAt;
    }

    public FileResponse(String fileName, String originalFileName, String fileDownloadUri, String fileType, long size) {
        this(null, fileName, originalFileName, fileDownloadUri, fileType, size, null, null, LocalDateTime.now());
    }

    public static FileResponse fromEntity(FileEntity entity) {
        if (entity == null) {
            return null;
        }
        return new FileResponse(
                entity.getId(),
                entity.getFileName(),
                entity.getOriginalFileName(),
                entity.getFileDownloadUri(),
                entity.getFileType(),
                entity.getSize() != null ? entity.getSize() : 0L,
                entity.getDescription(),
                entity.getCategory(),
                entity.getUploadedAt()
        );
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

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
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
