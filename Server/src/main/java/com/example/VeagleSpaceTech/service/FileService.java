package com.example.VeagleSpaceTech.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;

@Service
public class FileService {

    public String upload(MultipartFile file, String folderName) {
        return store(file, folderName, null);
    }

    public String uploadImage(MultipartFile file, String folderName) {
        return store(file, folderName, Set.of(
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif",
                "image/svg+xml"
        ));
    }

    public String uploadDocument(MultipartFile file, String folderName) {
        return store(file, folderName, Set.of(
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/octet-stream"
        ));
    }

    public void delete(String filePath) {
        if (filePath == null || filePath.isBlank()) {
            return;
        }

        String normalizedPath = filePath.replace("\\", "/").replaceFirst("^/+", "");

        if (!normalizedPath.startsWith("uploads/")) {
            return;
        }

        Path uploadsRoot = Paths.get(System.getProperty("user.dir"), "uploads").normalize();
        Path target = Paths.get(System.getProperty("user.dir"), normalizedPath).normalize();

        if (!target.startsWith(uploadsRoot)) {
            return;
        }

        try {
            Files.deleteIfExists(target);
        } catch (IOException exception) {
            throw new RuntimeException("Failed to delete file: " + exception.getMessage(), exception);
        }
    }

    private String store(MultipartFile file, String folderName, Set<String> allowedContentTypes) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (allowedContentTypes != null) {
            String contentType = file.getContentType();
            if (contentType == null || !allowedContentTypes.contains(contentType)) {
                throw new RuntimeException("Unsupported file type");
            }
        }

        try {
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());

            if (originalName.isBlank()) {
                throw new RuntimeException("Invalid file name");
            }

            String sanitizedName = originalName
                    .replace("\\", "_")
                    .replace("/", "_")
                    .replaceAll("[^A-Za-z0-9._-]", "_");

            Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads", folderName);
            Files.createDirectories(uploadDir);

            String fileName = System.currentTimeMillis() + "_" + sanitizedName;
            Path target = uploadDir.resolve(fileName);
            file.transferTo(target);

            return "/uploads/" + folderName + "/" + fileName;
        } catch (IOException exception) {
            throw new RuntimeException("File upload failed: " + exception.getMessage(), exception);
        }
    }
}
