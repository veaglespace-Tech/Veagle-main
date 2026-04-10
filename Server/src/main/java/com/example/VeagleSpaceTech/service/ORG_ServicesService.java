package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.FeatureRequestDTO;
import com.example.VeagleSpaceTech.DTO.request.ServiceRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.FeatureResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.PageResponse;
import com.example.VeagleSpaceTech.DTO.response.ServicesResponseDTO;
import com.example.VeagleSpaceTech.entity.Feature;
import com.example.VeagleSpaceTech.entity.Services;
import com.example.VeagleSpaceTech.repo.ORG_ServicesRepo;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class ORG_ServicesService {

    @Autowired
    private ORG_ServicesRepo orgServicesRepo;

    private String baseUrl = "http://localhost:8080/uploads/services/";

    // Store Image and Data
    public ServicesResponseDTO save(MultipartFile file, ServiceRequestDTO request) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is required");
        }

        if (!file.getContentType().startsWith("image/")) {
            throw new RuntimeException("Only image files allowed");
        }

//        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String originalName = file.getOriginalFilename();

        if (originalName == null) {
            throw new RuntimeException("Invalid file name");
        }

// 🔥 REMOVE SPACES + CLEAN NAME
        originalName = originalName.replaceAll("\\s+", "_");

        String fileName = System.currentTimeMillis() + "_" + originalName;
        Path path = Paths.get("uploads/services/" + fileName);

        try {
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed");
        }

        Services service = new Services();
        service.setTitle(request.title());
        service.setDescription(request.description());
        service.setImageUrl(fileName);

        if (request.features() != null && !request.features().isEmpty()) {
            List<Feature> featureList = request.features().stream()
                    .map(f -> {
                        Feature feature = new Feature();
                        feature.setName(f.name());
                        feature.setService(service);
                        return feature;
                    })
                    .toList();
            service.setFeatures(featureList);
        }

        Services saved = orgServicesRepo.save(service);

        return new ServicesResponseDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                baseUrl + saved.getImageUrl(),
                saved.getFeatures().stream()
                        .map(f -> new FeatureResponseDTO(f.getId(), f.getName()))
                        .toList()
        );
    }

    public ServicesResponseDTO update(Long id, MultipartFile file, ServiceRequestDTO request) {

        // 🔥 Fetch existing service
        Services service = orgServicesRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // 🔥 Update basic fields
        service.setTitle(request.title());
        service.setDescription(request.description());

        // 🔥 Update image (optional)
        if (file != null && !file.isEmpty()) {

            if (!file.getContentType().startsWith("image/")) {
                throw new RuntimeException("Only image allowed");
            }

            String originalName = file.getOriginalFilename();

            if (originalName == null) {
                throw new RuntimeException("Invalid file name");
            }

            // remove spaces
            originalName = originalName.replaceAll("\\s+", "_");

            String fileName = System.currentTimeMillis() + "_" + originalName;
            Path path = Paths.get("uploads/services/" + fileName);

            try {
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Image upload failed");
            }

            service.setImageUrl(fileName);
        }

        // 🔥 FIXED: Update features properly (NO .toList())
        if (request.features() != null) {

            // remove old features
            service.getFeatures().clear();

            // add new features
            for (FeatureRequestDTO f : request.features()) {
                Feature feature = new Feature();
                feature.setName(f.name());
                feature.setService(service); // 🔥 VERY IMPORTANT

                service.getFeatures().add(feature);
            }
        }

        // 🔥 Save updated entity
        Services saved = orgServicesRepo.save(service);

        // 🔥 Base URL (adjust if needed)
        String baseUrl = "http://localhost:8080/uploads/services/";

        // 🔥 Return DTO
        return new ServicesResponseDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                baseUrl + saved.getImageUrl(),
                saved.getFeatures().stream()
                        .map(f -> new FeatureResponseDTO(
                                f.getId(),
                                f.getName()
                        ))
                        .toList()
        );
    }
    public void deleted(Long id) {
         orgServicesRepo.deleteById(id);
    }

    // Used for to Show all Services using Pagenation
//    public PageResponse<ServicesResponseDTO> getServices(String keyword, int page, int size) {
//
//        size = Math.min(size, 20);
//
//        Pageable pageable = PageRequest.of(page, size);
//
//        Page<Services> servicePage;
//
//        if (keyword == null || keyword.trim().isEmpty()) {
//            servicePage = orgServicesRepo.findAll(pageable);
//        } else {
//            servicePage = orgServicesRepo.findByTitleContainingIgnoreCase(keyword, pageable);
//        }
//
//        // Handle overflow page
//        if (page >= servicePage.getTotalPages() && servicePage.getTotalPages() > 0) {
//            pageable = PageRequest.of(servicePage.getTotalPages() - 1, size);
//
//            if (keyword == null || keyword.trim().isEmpty()) {
//                servicePage = orgServicesRepo.findAll(pageable);
//            } else {
//                servicePage = orgServicesRepo.findByTitleContainingIgnoreCase(keyword, pageable);
//            }
//        }
//
//        // Convert to DTO
//        List<ServicesResponseDTO> data = servicePage.getContent()
//                .stream()
//                .map(ser -> new ServicesResponseDTO(
//                        ser.getId(),
//                        ser.getTitle(),
//                        ser.getDescription(),
//                        ser.getImageUrl(),
//                        ser.getFeatures()
//                                .stream()
//                                .map(f -> new FeatureResponseDTO(
//                                        f.getId(),
//                                        f.getName()
//                                ))
//                                .toList()
//                ))
//                .toList();
//
//        //  RETURN YOUR DTO WRAPPER (IMPORTANT)
//        return new PageResponse<>(
//                data,
//                servicePage.getTotalPages(),
//                servicePage.getTotalElements(),
//                servicePage.getNumber()
//        );
//    }


    public @Nullable ServicesResponseDTO getServiceById(Long id) {
          Services service = orgServicesRepo.findById(id).orElseThrow(() -> new RuntimeException("Service not found"));

          List<Feature> f = service.getFeatures();

        List<FeatureResponseDTO> fet = f.stream()
                .map(feature -> new FeatureResponseDTO(
                        feature.getId(),
                        feature.getName()   // NOT getService()
                ))
                .toList();


          return new ServicesResponseDTO(
                    service.getId(),
                    service.getTitle(),
                    service.getDescription(),
                  baseUrl + service.getImageUrl(),
                    fet
            );
    }


    public List<ServicesResponseDTO> getAllServices(String keyword) {

        List<Services> services;

        if (keyword == null || keyword.trim().isEmpty()) {
            services = orgServicesRepo.findAll();
        } else {
            services = orgServicesRepo.findByTitleContainingIgnoreCase(keyword);
        }

        return services.stream()
                .map(ser -> new ServicesResponseDTO(
                        ser.getId(),
                        ser.getTitle(),
                        ser.getDescription(),
                        baseUrl + ser.getImageUrl(),
                        ser.getFeatures()
                                .stream()
                                .map(f -> new FeatureResponseDTO(
                                        f.getId(),
                                        f.getName()
                                ))
                                .toList()
                ))
                .toList();
    }


}
