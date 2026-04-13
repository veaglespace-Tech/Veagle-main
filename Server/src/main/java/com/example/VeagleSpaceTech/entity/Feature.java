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

	public Services getService() {
		return service;
	}

	public void setService(Services service) {
		this.service = service;
	}
    
}