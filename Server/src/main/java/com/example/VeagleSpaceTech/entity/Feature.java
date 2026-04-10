package com.example.VeagleSpaceTech.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "features")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;
}