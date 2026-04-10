package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.FeatureRequestDTO;
import com.example.VeagleSpaceTech.DTO.request.ServiceRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.FeatureResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.ServicesResponseDTO;
import com.example.VeagleSpaceTech.entity.Feature;
import com.example.VeagleSpaceTech.entity.Services;
import com.example.VeagleSpaceTech.exception.ResourceNotFoundException;
import com.example.VeagleSpaceTech.repo.ORG_ServicesRepo;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class ORG_ServicesService {

    @Autowired
    private ORG_ServicesRepo orgServicesRepo;

    private final String baseUrl = "http://localhost:8080";

    public ServicesResponseDTO save(MultipartFile file, ServiceRequestDTO request) {
        validateImage(file);

        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            throw new RuntimeException("Invalid file name");
        }

        String fileName = storeFile(file, originalName);

        Services service = new Services();
        service.setTitle(request.title());
        service.setDescription(request.description());
        service.setImageUrl(fileName);
        service.setFeatures(buildFeatures(service, request.features()));

        Services saved = orgServicesRepo.save(service);
        return toDto(saved);
    }

    public ServicesResponseDTO update(Long id, MultipartFile file, ServiceRequestDTO request) {
        Services service = orgServicesRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        service.setTitle(request.title());
        service.setDescription(request.description());

        if (file != null && !file.isEmpty()) {
            validateImage(file);

            String originalName = file.getOriginalFilename();
            if (originalName == null) {
                throw new RuntimeException("Invalid file name");
            }

            service.setImageUrl(storeFile(file, originalName));
        }

        if (service.getFeatures() == null) {
            service.setFeatures(new ArrayList<>());
        }

        if (request.features() != null) {
            service.getFeatures().clear();
            service.getFeatures().addAll(buildFeatures(service, request.features()));
        }

        return toDto(orgServicesRepo.save(service));
    }

    public void deleted(Long id) {
        if (!orgServicesRepo.existsById(id)) {
            throw new ResourceNotFoundException("Service not found");
        }

        orgServicesRepo.deleteById(id);
    }

    public @Nullable ServicesResponseDTO getServiceById(Long id) {
        Services service = orgServicesRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        return toDto(service);
    }

    public List<ServicesResponseDTO> getAllServices(String keyword) {
        List<Services> services;

        if (keyword == null || keyword.trim().isEmpty()) {
            services = orgServicesRepo.findAll();
        } else {
            services = orgServicesRepo.findByTitleContainingIgnoreCase(keyword);
        }

        return services.stream()
                .map(this::toDto)
                .toList();
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files allowed");
        }
    }

    private String storeFile(MultipartFile file, String originalName) {
        String cleanedName = originalName.replaceAll("\\s+", "_");
        String fileName = System.currentTimeMillis() + "_" + cleanedName;
        Path path = Paths.get("uploads/services/" + fileName);

        try {
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            return fileName;
        } catch (IOException exception) {
            throw new RuntimeException("Image upload failed");
        }
    }

    private List<Feature> buildFeatures(Services service, List<FeatureRequestDTO> requestedFeatures) {
        if (requestedFeatures == null || requestedFeatures.isEmpty()) {
            return new ArrayList<>();
        }

        return requestedFeatures.stream()
                .map(item -> {
                    Feature feature = new Feature();
                    feature.setName(item.name());
                    feature.setService(service);
                    return feature;
                })
                .toList();
    }

    private ServicesResponseDTO toDto(Services service) {
        List<FeatureResponseDTO> features = (service.getFeatures() == null ? List.<Feature>of() : service.getFeatures())
                .stream()
                .map(item -> new FeatureResponseDTO(item.getId(), item.getName()))
                .toList();

        return new ServicesResponseDTO(
                service.getId(),
                service.getTitle(),
                service.getDescription(),
                resolveImageUrl(service.getImageUrl()),
                features
        );
    }

    private String resolveImageUrl(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        if (value.startsWith("http://") || value.startsWith("https://")) {
            return value;
        }

        if (value.startsWith("/uploads/")) {
            return baseUrl + value;
        }

        if (value.startsWith("/")) {
            return value;
        }

        return baseUrl + "/uploads/services/" + value;
    }
}
