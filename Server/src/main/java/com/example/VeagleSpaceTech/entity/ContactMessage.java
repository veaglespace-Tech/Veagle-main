package com.example.VeagleSpaceTech.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String subject;

    private String phone;      // ✅ renamed (instead of contact)

    private String company;    // ✅ new

    private String service;    // ✅ new

    private String budget;     // ✅ new

    private String timeline;   // ✅ new

    @Column(length = 2000)
    private String message;

    private boolean isRead = false;

    @CreationTimestamp
    private LocalDateTime createdAt = LocalDateTime.now();

}