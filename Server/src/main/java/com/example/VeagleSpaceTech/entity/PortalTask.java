package com.example.VeagleSpaceTech.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "portal_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortalTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "section_name", nullable = false)
    private String section;

    @Column(nullable = false)
    private String priority;

    private String assignedTo;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.priority == null || this.priority.isBlank()) {
            this.priority = "medium";
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "todo";
        }
        if (this.section == null || this.section.isBlank()) {
            this.section = "Homepage";
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
