package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.entity.PortalTask;
import com.example.VeagleSpaceTech.repo.PortalTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PortalTaskService {

    private final PortalTaskRepository portalTaskRepository;

    public List<PortalTask> getAllTasks() {
        return portalTaskRepository.findAllByOrderByUpdatedAtDesc();
    }

    public PortalTask createTask(Map<String, Object> body) {
        PortalTask task = PortalTask.builder()
                .title(readText(body.get("title")))
                .section(readText(body.get("section")))
                .priority(readText(body.get("priority")))
                .assignedTo(readText(body.get("assignedTo")))
                .summary(readText(body.get("summary")))
                .status(readText(body.get("status")))
                .build();

        return portalTaskRepository.save(task);
    }

    public PortalTask updateTask(Long id, Map<String, Object> updates) {
        PortalTask task = portalTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (updates.containsKey("title")) {
            task.setTitle(readText(updates.get("title")));
        }
        if (updates.containsKey("section")) {
            task.setSection(readText(updates.get("section")));
        }
        if (updates.containsKey("priority")) {
            task.setPriority(readText(updates.get("priority")));
        }
        if (updates.containsKey("assignedTo")) {
            task.setAssignedTo(readText(updates.get("assignedTo")));
        }
        if (updates.containsKey("summary")) {
            task.setSummary(readText(updates.get("summary")));
        }
        if (updates.containsKey("status")) {
            task.setStatus(readText(updates.get("status")));
        }

        return portalTaskRepository.save(task);
    }

    public void deleteTask(Long id) {
        if (!portalTaskRepository.existsById(id)) {
            throw new RuntimeException("Task not found");
        }

        portalTaskRepository.deleteById(id);
    }

    private String readText(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }
}
