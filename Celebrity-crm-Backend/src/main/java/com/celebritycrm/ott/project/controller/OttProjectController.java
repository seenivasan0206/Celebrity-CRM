package com.celebritycrm.ott.project.controller;

import com.celebritycrm.ott.project.dto.OttProjectRequestDto;
import com.celebritycrm.ott.project.dto.OttProjectResponseDto;
import com.celebritycrm.ott.project.service.OttProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/ott/projects", "/api/ott-projects"})
public class OttProjectController {

    private final OttProjectService ottProjectService;

    public OttProjectController(OttProjectService ottProjectService) {
        this.ottProjectService = ottProjectService;
    }

    @PostMapping
    public ResponseEntity<OttProjectResponseDto> createProject(@Valid @RequestBody OttProjectRequestDto request) {
        OttProjectResponseDto response = ottProjectService.createProject(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OttProjectResponseDto>> getAllProjects(
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String genre) {
        return ResponseEntity.ok(ottProjectService.getAllProjects(platform, status, genre));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OttProjectResponseDto> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(ottProjectService.getProjectById(id));
    }

    @GetMapping("/platform/{platform}")
    public ResponseEntity<List<OttProjectResponseDto>> getProjectsByPlatform(@PathVariable String platform) {
        return ResponseEntity.ok(ottProjectService.getProjectsByPlatform(platform));
    }

    @GetMapping("/celebrity/{celebrityId}")
    public ResponseEntity<List<OttProjectResponseDto>> getProjectsByCelebrity(@PathVariable Long celebrityId) {
        return ResponseEntity.ok(ottProjectService.getProjectsByCelebrity(celebrityId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OttProjectResponseDto> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody OttProjectRequestDto request) {
        return ResponseEntity.ok(ottProjectService.updateProject(id, request));
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<OttProjectResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ottProjectService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        ottProjectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
