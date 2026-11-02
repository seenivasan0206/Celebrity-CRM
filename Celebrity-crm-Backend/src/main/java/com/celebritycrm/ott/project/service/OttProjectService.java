package com.celebritycrm.ott.project.service;

import com.celebritycrm.common.ResourceNotFoundException;
import com.celebritycrm.ott.project.dto.OttProjectRequestDto;
import com.celebritycrm.ott.project.dto.OttProjectResponseDto;
import com.celebritycrm.ott.project.entity.OttProject;
import com.celebritycrm.ott.project.repository.OttProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OttProjectService {

    private final OttProjectRepository ottProjectRepository;

    public OttProjectService(OttProjectRepository ottProjectRepository) {
        this.ottProjectRepository = ottProjectRepository;
    }

    public OttProjectResponseDto createProject(OttProjectRequestDto request) {
        OttProject project = new OttProject();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setPlatform(request.getPlatform());
        project.setGenre(request.getGenre());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            project.setStatus(request.getStatus().toUpperCase());
        } else {
            project.setStatus("IN_PRODUCTION");
        }

        project.setDirector(request.getDirector());
        project.setProducer(request.getProducer());
        project.setBudget(request.getBudget());
        project.setReleaseDate(request.getReleaseDate());

        project.setLeadStar(request.getLeadStar());
        project.setCelebrityId(request.getCelebrityId());
        project.setEpisodes(request.getEpisodes());

        OttProject saved = ottProjectRepository.save(project);
        return mapToResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public List<OttProjectResponseDto> getAllProjects(String platform, String status, String genre) {
        List<OttProject> list;
        if (platform != null && !platform.isBlank() && status != null && !status.isBlank()) {
            list = ottProjectRepository.findByPlatformIgnoreCaseAndStatusIgnoreCase(platform.trim(), status.trim());
        } else if (platform != null && !platform.isBlank()) {
            list = ottProjectRepository.findByPlatformIgnoreCase(platform.trim());
        } else if (status != null && !status.isBlank()) {
            list = ottProjectRepository.findByStatusIgnoreCase(status.trim());
        } else if (genre != null && !genre.isBlank()) {
            list = ottProjectRepository.findByGenreIgnoreCase(genre.trim());
        } else {
            list = ottProjectRepository.findAll();
        }
        return list.stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OttProjectResponseDto getProjectById(Long id) {
        OttProject project = ottProjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OTT project not found with ID: " + id));
        return mapToResponseDto(project);
    }

    @Transactional(readOnly = true)
    public List<OttProjectResponseDto> getProjectsByPlatform(String platform) {
        return ottProjectRepository.findByPlatformIgnoreCase(platform.trim()).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OttProjectResponseDto> getProjectsByCelebrity(Long celebrityId) {
        return ottProjectRepository.findByCelebrityId(celebrityId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public OttProjectResponseDto updateProject(Long id, OttProjectRequestDto request) {
        OttProject project = ottProjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OTT project not found with ID: " + id));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setPlatform(request.getPlatform());
        project.setGenre(request.getGenre());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            project.setStatus(request.getStatus().toUpperCase());
        }

        project.setDirector(request.getDirector());
        project.setProducer(request.getProducer());
        project.setBudget(request.getBudget());
        project.setReleaseDate(request.getReleaseDate());

        if (request.getLeadStar() != null) {
            project.setLeadStar(request.getLeadStar());
        }
        if (request.getCelebrityId() != null) {
            project.setCelebrityId(request.getCelebrityId());
        }
        if (request.getEpisodes() != null) {
            project.setEpisodes(request.getEpisodes());
        }

        OttProject updated = ottProjectRepository.save(project);
        return mapToResponseDto(updated);
    }

    public OttProjectResponseDto updateStatus(Long id, String status) {
        OttProject project = ottProjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OTT project not found with ID: " + id));

        if (status != null && !status.isBlank()) {
            project.setStatus(status.trim().toUpperCase());
        }

        OttProject updated = ottProjectRepository.save(project);
        return mapToResponseDto(updated);
    }

    public void deleteProject(Long id) {
        if (!ottProjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("OTT project not found with ID: " + id);
        }
        ottProjectRepository.deleteById(id);
    }

    public OttProjectResponseDto mapToResponseDto(OttProject project) {
        OttProjectResponseDto dto = new OttProjectResponseDto(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getPlatform(),
                project.getGenre(),
                project.getStatus(),
                project.getDirector(),
                project.getProducer(),
                project.getBudget(),
                project.getReleaseDate(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );

        dto.setLeadStar(project.getLeadStar());
        dto.setCelebrityId(project.getCelebrityId());
        dto.setEpisodes(project.getEpisodes());

        return dto;
    }
}
