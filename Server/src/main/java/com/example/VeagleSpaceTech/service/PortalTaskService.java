package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.PortalTaskRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.PortalTaskResponseDTO;
import com.example.VeagleSpaceTech.entity.PortalTask;
import com.example.VeagleSpaceTech.repo.PortalTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortalTaskService {

    private final PortalTaskRepository portalTaskRepository;

    public List<PortalTaskResponseDTO> getAllTasks() {
        return portalTaskRepository.findAllByOrderByUpdatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PortalTaskResponseDTO createTask(PortalTaskRequestDTO request) {
        if (request.title() == null || request.title().trim().isEmpty()) {
            throw new RuntimeException("Task title is required");
        }

        PortalTask task = PortalTask.builder()
                .title(request.title().trim())
                .section(defaultText(request.section(), "Homepage"))
                .priority(defaultText(request.priority(), "medium"))
                .assignedTo(trimToNull(request.assignedTo()))
                .summary(trimToEmpty(request.summary()))
                .status(defaultText(request.status(), "todo"))
                .build();

        return mapToResponse(portalTaskRepository.save(task));
    }

    public PortalTaskResponseDTO updateTask(Long id, PortalTaskRequestDTO request) {
        PortalTask task = portalTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (request.title() != null) {
            if (request.title().trim().isEmpty()) {
                throw new RuntimeException("Task title is required");
            }
            task.setTitle(request.title().trim());
        }

        if (request.section() != null) {
            task.setSection(defaultText(request.section(), "Homepage"));
        }

        if (request.priority() != null) {
            task.setPriority(defaultText(request.priority(), "medium"));
        }

        if (request.assignedTo() != null) {
            task.setAssignedTo(trimToNull(request.assignedTo()));
        }

        if (request.summary() != null) {
            task.setSummary(trimToEmpty(request.summary()));
        }

        if (request.status() != null) {
            task.setStatus(defaultText(request.status(), "todo"));
        }

        return mapToResponse(portalTaskRepository.save(task));
    }

    public void deleteTask(Long id) {
        if (!portalTaskRepository.existsById(id)) {
            throw new RuntimeException("Task not found");
        }

        portalTaskRepository.deleteById(id);
    }

    private PortalTaskResponseDTO mapToResponse(PortalTask task) {
        return new PortalTaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getSection(),
                task.getPriority(),
                task.getAssignedTo(),
                task.getSummary(),
                task.getStatus(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }

    private String defaultText(String value, String fallback) {
        String nextValue = trimToNull(value);
        return nextValue == null ? fallback : nextValue;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String nextValue = value.trim();
        return nextValue.isEmpty() ? null : nextValue;
    }

    private String trimToEmpty(String value) {
        String nextValue = trimToNull(value);
        return nextValue == null ? "" : nextValue;
    }
}
