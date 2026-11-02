package com.celebritycrm.files.service;

import com.celebritycrm.common.ResourceNotFoundException;
import com.celebritycrm.files.dto.FileResponse;
import com.celebritycrm.files.entity.FileEntity;
import com.celebritycrm.files.repository.FileRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FileService {

    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    private Path fileStorageLocation;
    private final FileRepository fileRepository;

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory: " + this.fileStorageLocation, ex);
        }
    }

    @Transactional
    public FileResponse storeFile(MultipartFile file, String description, String category) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty file.");
        }

        String rawOriginal = file.getOriginalFilename();
        String originalFileName = (rawOriginal != null && !rawOriginal.isBlank()) ? StringUtils.cleanPath(rawOriginal) : "unnamed";
        if (originalFileName.contains("..")) {
            throw new IllegalArgumentException("Filename contains invalid path sequence: " + originalFileName);
        }

        String extension = "";
        int extIndex = originalFileName.lastIndexOf(".");
        if (extIndex > 0) {
            extension = originalFileName.substring(extIndex);
        }

        String targetFileName = UUID.randomUUID() + extension;
        Path targetLocation = this.fileStorageLocation.resolve(targetFileName);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName, ex);
        }

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/download/")
                .path(targetFileName)
                .toUriString();

        FileEntity entity = new FileEntity(
                targetFileName,
                originalFileName,
                fileDownloadUri,
                file.getContentType(),
                file.getSize(),
                description,
                category
        );

        FileEntity saved = fileRepository.save(entity);
        return FileResponse.fromEntity(saved);
    }

    public FileResponse storeFile(MultipartFile file) {
        return storeFile(file, null, null);
    }

    @Transactional
    public List<FileResponse> storeFiles(MultipartFile[] files, String description, String category) {
        if (files == null || files.length == 0) {
            return Collections.emptyList();
        }
        return Arrays.stream(files)
                .map(f -> storeFile(f, description, category))
                .collect(Collectors.toList());
    }

    public List<FileResponse> storeFiles(MultipartFile[] files) {
        return storeFiles(files, null, null);
    }

    public List<FileResponse> getAllFiles() {
        return fileRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream()
                .map(FileResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public FileResponse getFileById(Long id) {
        FileEntity entity = fileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File record not found with id: " + id));
        return FileResponse.fromEntity(entity);
    }

    public FileResponse getFileByFileName(String fileName) {
        FileEntity entity = fileRepository.findByFileName(fileName)
                .orElseThrow(() -> new ResourceNotFoundException("File record not found with name: " + fileName));
        return FileResponse.fromEntity(entity);
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Physical file not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Physical file not found: " + fileName);
        }
    }

    @Transactional
    public void deleteFile(String fileName) {
        Optional<FileEntity> entityOpt = fileRepository.findByFileName(fileName);
        Path filePath = this.fileStorageLocation.resolve(fileName).normalize();

        boolean physicalDeleted = false;
        try {
            physicalDeleted = Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file from disk: " + fileName, ex);
        }

        if (entityOpt.isPresent()) {
            fileRepository.delete(entityOpt.get());
        } else if (!physicalDeleted) {
            throw new ResourceNotFoundException("File not found: " + fileName);
        }
    }

    @Transactional
    public void deleteFileById(Long id) {
        FileEntity entity = fileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File record not found with id: " + id));

        Path filePath = this.fileStorageLocation.resolve(entity.getFileName()).normalize();
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file from disk: " + entity.getFileName(), ex);
        }

        fileRepository.delete(entity);
    }
}
