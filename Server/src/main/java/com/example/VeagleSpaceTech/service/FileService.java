package com.example.VeagleSpaceTech.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;

@Service
public class FileService {

    private static final Set<String> CLOUDINARY_IMAGE_FOLDERS = Set.of(
            "services",
            "products",
            "portfolio",
            "clients"
    );

    private final Cloudinary cloudinary;

    public FileService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String upload(MultipartFile file, String folderName) {
        return storeLocal(file, folderName, null);
    }

    public String uploadImage(MultipartFile file, String folderName) {
        validate(file, Set.of(
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif",
                "image/svg+xml"
        ));

        try {
            String publicId = buildCloudinaryPublicId(file, folderName);
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "public_id", publicId,
                    "resource_type", "image",
                    "overwrite", false
            ));

            Object uploadedPublicId = uploadResult.get("public_id");
            if (uploadedPublicId == null) {
                throw new RuntimeException("Cloudinary upload did not return an image name");
            }

            return uploadedPublicId.toString();
        } catch (IOException exception) {
            throw new RuntimeException("Cloudinary image upload failed: " + exception.getMessage(), exception);
        }
    }

    public String uploadDocument(MultipartFile file, String folderName) {
        return storeLocal(file, folderName, Set.of(
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

        if (normalizedPath.startsWith("uploads/")) {
            deleteLocalFile(normalizedPath);
            return;
        }

        String publicId = resolveCloudinaryPublicId(filePath, normalizedPath);
        if (publicId == null) {
            return;
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
        } catch (IOException exception) {
            throw new RuntimeException("Failed to delete Cloudinary image: " + exception.getMessage(), exception);
        }
    }

    private String storeLocal(MultipartFile file, String folderName, Set<String> allowedContentTypes) {
        validate(file, allowedContentTypes);

        try {
            String originalName = cleanOriginalFileName(file);
            String sanitizedName = sanitizeFileName(originalName);

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

    private void deleteLocalFile(String normalizedPath) {
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

    private void validate(MultipartFile file, Set<String> allowedContentTypes) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (allowedContentTypes != null) {
            String contentType = file.getContentType();
            if (contentType == null || !allowedContentTypes.contains(contentType)) {
                throw new RuntimeException("Unsupported file type");
            }
        }
    }

    private String buildCloudinaryPublicId(MultipartFile file, String folderName) {
        String originalName = cleanOriginalFileName(file);
        String baseName = stripExtension(originalName);
        String sanitizedName = sanitizeFileName(baseName);
        String sanitizedFolderName = sanitizeFolderName(folderName);

        return sanitizedFolderName + "/" + System.currentTimeMillis() + "_" + sanitizedName;
    }

    private String cleanOriginalFileName(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFilename)) {
            throw new RuntimeException("Invalid file name");
        }

        String originalName = StringUtils.cleanPath(originalFilename);
        if (!StringUtils.hasText(originalName)) {
            throw new RuntimeException("Invalid file name");
        }

        return originalName;
    }

    private String stripExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex <= 0) {
            return fileName;
        }

        return fileName.substring(0, dotIndex);
    }

    private String sanitizeFileName(String value) {
        String sanitizedName = value
                .replace("\\", "_")
                .replace("/", "_")
                .replaceAll("[^A-Za-z0-9._-]", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_+|_+$", "");

        if (!StringUtils.hasText(sanitizedName)) {
            throw new RuntimeException("Invalid file name");
        }

        return sanitizedName;
    }

    private String sanitizeFolderName(String value) {
        String sanitizedFolderName = value == null ? "" : value.replaceAll("[^A-Za-z0-9_-]", "");

        if (!CLOUDINARY_IMAGE_FOLDERS.contains(sanitizedFolderName)) {
            throw new RuntimeException("Invalid image folder");
        }

        return sanitizedFolderName;
    }

    private String resolveCloudinaryPublicId(String filePath, String normalizedPath) {
        if (isStoredCloudinaryPublicId(normalizedPath)) {
            return normalizedPath;
        }

        if (filePath.toLowerCase().startsWith("http://") || filePath.toLowerCase().startsWith("https://")) {
            return extractCloudinaryPublicIdFromUrl(filePath);
        }

        return null;
    }

    private boolean isStoredCloudinaryPublicId(String value) {
        int slashIndex = value.indexOf('/');
        if (slashIndex <= 0) {
            return false;
        }

        String folderName = value.substring(0, slashIndex);
        return CLOUDINARY_IMAGE_FOLDERS.contains(folderName) && !value.contains("..");
    }

    private String extractCloudinaryPublicIdFromUrl(String value) {
        try {
            URI uri = URI.create(value);
            if (uri.getHost() == null || !uri.getHost().equalsIgnoreCase("res.cloudinary.com")) {
                return null;
            }

            String[] segments = uri.getPath().split("/");
            int uploadIndex = -1;
            for (int index = 0; index < segments.length; index++) {
                if ("upload".equals(segments[index])) {
                    uploadIndex = index;
                    break;
                }
            }

            if (uploadIndex < 0 || uploadIndex + 1 >= segments.length) {
                return null;
            }

            int publicIdStartIndex = uploadIndex + 1;
            if (segments[publicIdStartIndex].matches("v\\d+")) {
                publicIdStartIndex++;
            }

            if (publicIdStartIndex >= segments.length) {
                return null;
            }

            StringBuilder publicId = new StringBuilder();
            for (int index = publicIdStartIndex; index < segments.length; index++) {
                if (segments[index].isBlank()) {
                    continue;
                }

                if (publicId.length() > 0) {
                    publicId.append('/');
                }
                publicId.append(segments[index]);
            }

            String extractedPublicId = stripExtension(publicId.toString());
            return isStoredCloudinaryPublicId(extractedPublicId) ? extractedPublicId : null;
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }
}
