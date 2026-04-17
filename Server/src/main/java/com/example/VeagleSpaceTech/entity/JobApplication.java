package com.example.VeagleSpaceTech.entity;

import com.example.VeagleSpaceTech.enums.ApplicationStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Snapshot data
    private String name;
    private String email;
    private String phone;

    private String resumeUrl;
    private String publicId;

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

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getResumeUrl() {
		return resumeUrl;
	}

	public void setResumeUrl(String resumeUrl) {
		this.resumeUrl = resumeUrl;
	}

	public ApplicationStatus getStatus() {
		return status;
	}

	public void setStatus(ApplicationStatus status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public JobPost getJob() {
		return job;
	}

	public void setJob(JobPost job) {
		this.job = job;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
    
    

}