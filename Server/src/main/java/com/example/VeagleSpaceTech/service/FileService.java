package com.example.VeagleSpaceTech.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {

    public String upload(MultipartFile file, String folderName) {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        try {
            // ✅ FIX: absolute path
            String basePath = System.getProperty("user.dir");
            String uploadDir = basePath + "/uploads/" + folderName + "/";

            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalName = file.getOriginalFilename();
            String fileName = UUID.randomUUID() + "_" + originalName;

            String filePath = uploadDir + fileName;

            file.transferTo(new File(filePath));

            // return relative path (for browser access)
            return "uploads/" + folderName + "/" + fileName;

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }
}