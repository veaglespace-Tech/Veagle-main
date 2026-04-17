package com.example.VeagleSpaceTech.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    //  Save Image
    public Map upload(MultipartFile file) {
        try {
            return cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "uploads")
            );
        } catch (Exception e) {
            throw new RuntimeException("Upload failed");
        }
    }

    // Delete Image
    public void delete(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new RuntimeException("Delete failed");
        }
    }


}