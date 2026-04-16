package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.FeatureRequestDTO;
import com.example.VeagleSpaceTech.DTO.request.ServiceRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.FeatureResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.ServicesResponseDTO;
import com.example.VeagleSpaceTech.entity.Feature;
import com.example.VeagleSpaceTech.entity.Services;
import com.example.VeagleSpaceTech.repo.ORG_ServicesRepo;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ORG_ServicesService {

    @Autowired
    private ORG_ServicesRepo orgServicesRepo;

    @Autowired
    private FileService fileService;

    public ServicesResponseDTO save(MultipartFile file, ServiceRequestDTO request) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Service image is required");
        }

        Services service = new Services();
        service.setTitle(normalizeText(request.title()));
        service.setDescription(normalizeText(request.description()));
        service.setDetailTitle(normalizeText(request.detailTitle()));
        service.setDetailDescription(normalizeText(request.detailDescription()));
        service.setPageContent(normalizeText(request.pageContent()));
        service.setImageUrl(fileService.uploadImage(file, "services"));
        service.setFeatures(new ArrayList<>());

        if (request.features() != null) {
            for (FeatureRequestDTO featureRequest : request.features()) {
                Feature feature = new Feature();
                feature.setName(featureRequest.name().trim());
                feature.setService(service);
                service.getFeatures().add(feature);
            }
        }

        return mapToDTO(orgServicesRepo.save(service));
    }

    public ServicesResponseDTO update(Long id, MultipartFile file, ServiceRequestDTO request) {
        Services service = orgServicesRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setTitle(normalizeText(request.title()));
        service.setDescription(normalizeText(request.description()));
        service.setDetailTitle(normalizeText(request.detailTitle()));
        service.setDetailDescription(normalizeText(request.detailDescription()));
        service.setPageContent(normalizeText(request.pageContent()));

        if (file != null && !file.isEmpty()) {
            fileService.delete(service.getImageUrl());
            service.setImageUrl(fileService.uploadImage(file, "services"));
        }

        if (service.getFeatures() == null) {
            service.setFeatures(new ArrayList<>());
        }

        if (request.features() != null) {
            service.getFeatures().clear();

            for (FeatureRequestDTO featureRequest : request.features()) {
                Feature feature = new Feature();
                feature.setName(featureRequest.name().trim());
                feature.setService(service);
                service.getFeatures().add(feature);
            }
        }

        return mapToDTO(orgServicesRepo.save(service));
    }

    public void deleted(Long id) {
        Services service = orgServicesRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        orgServicesRepo.delete(service);
        fileService.delete(service.getImageUrl());
    }

    public @Nullable ServicesResponseDTO getServiceById(Long id) {
        Services service = orgServicesRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        return mapToDTO(service);
    }

    public List<ServicesResponseDTO> getAllServices(String keyword) {
        List<Services> services;

        if (keyword == null || keyword.trim().isEmpty()) {
            services = orgServicesRepo.findAll();
        } else {
            services = orgServicesRepo.findByTitleContainingIgnoreCase(keyword);
        }

        return services.stream()
                .map(this::mapToDTO)
                .toList();
    }

    private ServicesResponseDTO mapToDTO(Services service) {
        List<FeatureResponseDTO> features = service.getFeatures() == null
                ? List.of()
                : service.getFeatures().stream()
                        .map(feature -> new FeatureResponseDTO(feature.getId(), feature.getName()))
                        .toList();

        return new ServicesResponseDTO(
                service.getId(),
                service.getTitle(),
                service.getDescription(),
                service.getDetailTitle(),
                service.getDetailDescription(),
                service.getPageContent(),
                service.getImageUrl(),
                features);
    }

    private String normalizeText(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
