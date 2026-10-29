package com.celebritycrm.managers;

import com.celebritycrm.common.ResourceNotFoundException;
import com.celebritycrm.managers.dto.ManagerRequest;
import com.celebritycrm.managers.dto.ManagerResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ManagerService {

    private final ManagerRepository managerRepository;

    public ManagerService(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    public ManagerResponse createManager(ManagerRequest request) {
        if (managerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("A manager with email '" + request.getEmail() + "' already exists.");
        }

        Manager manager = new Manager();
        manager.setName(request.getName());
        manager.setEmail(request.getEmail());
        manager.setPhone(request.getPhone());
        manager.setAgency(request.getAgency());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            manager.setStatus(request.getStatus().toUpperCase());
        }

        Manager saved = managerRepository.save(manager);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ManagerResponse> getAllManagers() {
        return managerRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ManagerResponse getManagerById(Long id) {
        Manager manager = managerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + id));
        return mapToResponse(manager);
    }

    public ManagerResponse updateManager(Long id, ManagerRequest request) {
        Manager manager = managerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + id));

        if (managerRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new IllegalArgumentException("Another manager with email '" + request.getEmail() + "' already exists.");
        }

        manager.setName(request.getName());
        manager.setEmail(request.getEmail());
        manager.setPhone(request.getPhone());
        manager.setAgency(request.getAgency());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            manager.setStatus(request.getStatus().toUpperCase());
        }

        Manager updated = managerRepository.save(manager);
        return mapToResponse(updated);
    }

    public void deleteManager(Long id) {
        if (!managerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Manager not found with ID: " + id);
        }
        managerRepository.deleteById(id);
    }

    public ManagerResponse mapToResponse(Manager manager) {
        ManagerResponse response = new ManagerResponse();
        response.setId(manager.getId());
        response.setName(manager.getName());
        response.setEmail(manager.getEmail());
        response.setPhone(manager.getPhone());
        response.setAgency(manager.getAgency());
        response.setStatus(manager.getStatus());
        response.setCreatedAt(manager.getCreatedAt());
        response.setUpdatedAt(manager.getUpdatedAt());
        return response;
    }
}

