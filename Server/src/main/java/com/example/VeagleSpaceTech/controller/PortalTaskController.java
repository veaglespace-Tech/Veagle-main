package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.PortalTaskRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.PortalTaskResponseDTO;
import com.example.VeagleSpaceTech.service.PortalTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PortalTaskController {

    private final PortalTaskService portalTaskService;

    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @GetMapping("/api/admin/tasks")
    public ResponseEntity<List<PortalTaskResponseDTO>> getTasks() {
        return ResponseEntity.ok(portalTaskService.getAllTasks());
    }

    @PreAuthorize("hasRole('SADMIN')")
    @PostMapping("/api/admin/tasks")
    public ResponseEntity<PortalTaskResponseDTO> createTask(@RequestBody PortalTaskRequestDTO request) {
        return ResponseEntity.status(201).body(portalTaskService.createTask(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PatchMapping("/api/admin/tasks/{id}")
    public ResponseEntity<PortalTaskResponseDTO> updateTask(
            @PathVariable Long id,
            @RequestBody PortalTaskRequestDTO request
    ) {
        return ResponseEntity.ok(portalTaskService.updateTask(id, request));
    }

    @PreAuthorize("hasRole('SADMIN')")
    @DeleteMapping("/api/admin/tasks/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        portalTaskService.deleteTask(id);
        return ResponseEntity.ok("Task deleted successfully");
    }
}
