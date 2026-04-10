package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.ProductRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ProductResponseDTO;
import com.example.VeagleSpaceTech.entity.Category;
import com.example.VeagleSpaceTech.entity.Product;
import com.example.VeagleSpaceTech.repo.CategoryRepository;
import com.example.VeagleSpaceTech.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class ProductsService {

    private final String baseUrl = "http://localhost:8080";

    @Autowired
    private ProductRepo productRepo;

//    private final String UPLOAD_DIR = "uploads/products/";
private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/products";
    @Autowired
    private CategoryRepository categoryRepository;

    public ProductResponseDTO addProduct(ProductRequestDTO request, MultipartFile file) {

        try {

            if (file == null || file.isEmpty()) {
                throw new RuntimeException("File is missing or empty");
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = UPLOAD_DIR + File.separator + fileName;

            File folder = new File(UPLOAD_DIR);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            System.out.println("Saving file to: " + filePath);

            file.transferTo(new File(filePath));

            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            Product product = new Product();
            product.setTitle(request.title());
            product.setDescription(request.description());
            product.setCategory(category);
            product.setIsActive(request.isActive() != null ? request.isActive() : true);

            product.setImageUrl("/uploads/products/" + fileName); // 🔥 FIXED URL

            Product saved = productRepo.save(product);

            return new ProductResponseDTO(
                    saved.getId(),
                    saved.getTitle(),
                    saved.getDescription(),
                    saved.getImageUrl(),
                    saved.getCategory().getName(),
                    saved.getIsActive()
            );

        } catch (IOException e) {
            e.printStackTrace(); // 🔥 IMPORTANT
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    // Gett All Products
    public List<ProductResponseDTO> getAllProducts() {

        List<Product> products = productRepo.findAll();

        return products.stream()
                .map(p -> new ProductResponseDTO(
                        p.getId(),
                        p.getTitle(),
                        p.getDescription(),
                        resolveImageUrl(p.getImageUrl()),
                        p.getCategory().getName(),
                        p.getIsActive()
                ))
                .toList();
    }

    //Status Updation
    public void updateProductStatus(Long id, Boolean isActive) {

        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setIsActive(isActive);

        productRepo.save(product);
    }

// Delete Product
    public String deleteProduct(Long id) {

        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setIsActive(false); // ✅ soft delete

        productRepo.save(product);

        return "Product deactivated successfully";
    }


    // Update Product
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request, MultipartFile file) {

        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setTitle(request.title());
        product.setDescription(request.description());
        product.setCategory(category);

        if (request.isActive() != null) {
            product.setIsActive(request.isActive());
        }

        if (file != null && !file.isEmpty()) {

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String uploadDir = System.getProperty("user.dir") + "/uploads/products";

            File folder = new File(uploadDir);
            if (!folder.exists()) folder.mkdirs();

            File destination = new File(folder, fileName);

            try {
                file.transferTo(destination);
            } catch (IOException e) {
                throw new RuntimeException("Image upload failed: " + e.getMessage());
            }

            product.setImageUrl("/uploads/products/" + fileName);
        }

        Product updated = productRepo.save(product);

        return new ProductResponseDTO(
                updated.getId(),
                updated.getTitle(),
                updated.getDescription(),
                resolveImageUrl(updated.getImageUrl()),
                updated.getCategory().getName(),
                updated.getIsActive()
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

        return baseUrl + "/uploads/products/" + value;
    }

}
