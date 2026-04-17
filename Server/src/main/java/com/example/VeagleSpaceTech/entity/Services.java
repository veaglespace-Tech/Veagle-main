package com.example.VeagleSpaceTech.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "services")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Services { // Organization Services

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private String detailTitle;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String detailDescription;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String pageContent;

    private String imageUrl;
    private String publicId;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Feature> features;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getDetailTitle() {
		return detailTitle;
	}

	public void setDetailTitle(String detailTitle) {
		this.detailTitle = detailTitle;
	}

	public String getDetailDescription() {
		return detailDescription;
	}

	public void setDetailDescription(String detailDescription) {
		this.detailDescription = detailDescription;
	}

	public String getPageContent() {
		return pageContent;
	}

	public void setPageContent(String pageContent) {
		this.pageContent = pageContent;
	}

	public List<Feature> getFeatures() {
		return features;
	}

	public void setFeatures(List<Feature> features) {
		this.features = features;
	}
    
    
}
