package com.celebritycrm.files.controller;

import com.celebritycrm.files.dto.FileResponse;
import com.celebritycrm.files.service.FileService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping(value = {"", "/upload"})
    public ResponseEntity<?> uploadFile(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false) String category,
            HttpServletRequest request) {

        if (file != null && !file.isEmpty()) {
            FileResponse response = fileService.storeFile(file, description, category);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        if (files != null && files.length > 0 && !files[0].isEmpty()) {
            List<FileResponse> responses = fileService.storeFiles(files, description, category);
            return new ResponseEntity<>(responses, HttpStatus.CREATED);
        }

        if (request instanceof MultipartHttpServletRequest multipartRequest) {
            Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
            for (MultipartFile part : fileMap.values()) {
                if (part != null && !part.isEmpty()) {
                    FileResponse response = fileService.storeFile(part, description, category);
                    return new ResponseEntity<>(response, HttpStatus.CREATED);
                }
            }
        }

        throw new IllegalArgumentException("No file attached. In Postman, select Body -> form-data -> Key 'file' of type File.");
    }

    @PostMapping("/upload-multiple")
    public ResponseEntity<List<FileResponse>> uploadMultipleFiles(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false) String category) {
        List<FileResponse> responses = fileService.storeFiles(files, description, category);
        return new ResponseEntity<>(responses, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FileResponse>> getAllFiles() {
        return ResponseEntity.ok(fileService.getAllFiles());
    }

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<FileResponse> getFileById(@PathVariable Long id) {
        return ResponseEntity.ok(fileService.getFileById(id));
    }

    @GetMapping("/info/{fileName:.+}")
    public ResponseEntity<FileResponse> getFileByFileName(@PathVariable String fileName) {
        return ResponseEntity.ok(fileService.getFileByFileName(fileName));
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileService.loadFileAsResource(fileName);
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ignored) {
        }
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/view/{fileName:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileService.loadFileAsResource(fileName);
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ignored) {
        }
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{fileName:.+}")
    public ResponseEntity<Void> deleteFile(@PathVariable String fileName) {
        fileService.deleteFile(fileName);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<Void> deleteFileById(@PathVariable Long id) {
        fileService.deleteFileById(id);
        return ResponseEntity.noContent().build();
    }
}
