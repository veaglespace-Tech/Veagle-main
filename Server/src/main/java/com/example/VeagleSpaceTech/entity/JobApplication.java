package com.example.VeagleSpaceTech.entity;

import com.example.VeagleSpaceTech.enums.ApplicationStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Snapshot data
    private String name;
    private String email;
    private String phone;

    private String resumeUrl;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // Relations
    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private JobPost job;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Need To Login Or can apply without login

}