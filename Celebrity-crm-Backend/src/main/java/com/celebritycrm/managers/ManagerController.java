package com.celebritycrm.managers;

import com.celebritycrm.managers.dto.ManagerRequest;
import com.celebritycrm.managers.dto.ManagerResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ROLE_ADMIN') or hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<ManagerResponse> createManager(@Valid @RequestBody ManagerRequest request) {
        ManagerResponse response = managerService.createManager(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ManagerResponse>> getAllManagers() {
        return ResponseEntity.ok(managerService.getAllManagers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManagerResponse> getManagerById(@PathVariable Long id) {
        return ResponseEntity.ok(managerService.getManagerById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROLE_ADMIN', 'MANAGER', 'ROLE_MANAGER') or hasAnyAuthority('ADMIN', 'ROLE_ADMIN', 'MANAGER', 'ROLE_MANAGER')")
    public ResponseEntity<ManagerResponse> updateManager(
            @PathVariable Long id,
            @Valid @RequestBody ManagerRequest request) {
        return ResponseEntity.ok(managerService.updateManager(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROLE_ADMIN') or hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<Void> deleteManager(@PathVariable Long id) {
        managerService.deleteManager(id);
        return ResponseEntity.noContent().build();
    }
}
