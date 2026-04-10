package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.entity.PortalTask;
import com.example.VeagleSpaceTech.service.PortalTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
public class PortalTaskController {

    private final PortalTaskService portalTaskService;

    @GetMapping("/admin/tasks")
    public ResponseEntity<List<PortalTask>> getTasks() {
        return ResponseEntity.ok(portalTaskService.getAllTasks());
    }

    @PostMapping("/admin/tasks")
    public ResponseEntity<PortalTask> createTask(@RequestBody Map<String, Object> body) {
        return ResponseEntity.status(201).body(portalTaskService.createTask(body));
    }

    @PatchMapping("/admin/tasks/{id}")
    public ResponseEntity<PortalTask> updateTask(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates
    ) {
        return ResponseEntity.ok(portalTaskService.updateTask(id, updates));
    }

    @DeleteMapping("/admin/tasks/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        portalTaskService.deleteTask(id);
        return ResponseEntity.ok("Task deleted");
    }
}
