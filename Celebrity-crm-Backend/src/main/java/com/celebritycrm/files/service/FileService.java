package com.celebritycrm.files.service;

import com.celebritycrm.common.ResourceNotFoundException;
import com.celebritycrm.files.dto.FileResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
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
import java.util.stream.Stream;

@Service
public class FileService {

    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory: " + this.fileStorageLocation, ex);
        }
    }

    public FileResponse storeFile(MultipartFile file) {
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

        return new FileResponse(
                targetFileName,
                originalFileName,
                fileDownloadUri,
                file.getContentType(),
                file.getSize()
        );
    }

    public List<FileResponse> storeFiles(MultipartFile[] files) {
        if (files == null || files.length == 0) {
            return Collections.emptyList();
        }
        return Arrays.stream(files)
                .map(this::storeFile)
                .collect(Collectors.toList());
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found: " + fileName);
        }
    }

    public boolean deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            if (!Files.exists(filePath)) {
                throw new ResourceNotFoundException("File not found: " + fileName);
            }
            return Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file: " + fileName, ex);
        }
    }

    public List<FileResponse> getAllFiles() {
        try (Stream<Path> stream = Files.list(this.fileStorageLocation)) {
            return stream.filter(Files::isRegularFile)
                    .map(path -> {
                        String name = path.getFileName().toString();
                        long size = 0L;
                        try {
                            size = Files.size(path);
                        } catch (IOException ignored) {
                        }
                        String uri = ServletUriComponentsBuilder.fromCurrentContextPath()
                                .path("/api/files/download/")
                                .path(name)
                                .toUriString();
                        String contentType = null;
                        try {
                            contentType = Files.probeContentType(path);
                        } catch (IOException ignored) {
                        }
                        return new FileResponse(name, name, uri, contentType, size);
                    })
                    .collect(Collectors.toList());
        } catch (IOException ex) {
            return Collections.emptyList();
        }
    }
}
