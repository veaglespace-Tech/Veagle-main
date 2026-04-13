package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.ProductRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ProductResponseDTO;
import com.example.VeagleSpaceTech.entity.Category;
import com.example.VeagleSpaceTech.entity.Product;
import com.example.VeagleSpaceTech.repo.CategoryRepository;
import com.example.VeagleSpaceTech.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ProductsService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FileService fileService;

    public ProductResponseDTO addProduct(ProductRequestDTO request, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Product image is required");
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setTitle(request.title());
        product.setDescription(request.description());
        product.setCategory(category);
        product.setIsActive(request.isActive() != null ? request.isActive() : true);
        product.setImageUrl(fileService.uploadImage(file, "products"));

        return mapToDTO(productRepo.save(product));
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productRepo.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    public void updateProductStatus(Long id, Boolean isActive) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setIsActive(isActive);
        productRepo.save(product);
    }

    public String deleteProduct(Long id) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        productRepo.delete(product);
        fileService.delete(product.getImageUrl());

        return "Product deleted successfully";
    }

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
            fileService.delete(product.getImageUrl());
            product.setImageUrl(fileService.uploadImage(file, "products"));
        }

        return mapToDTO(productRepo.save(product));
    }

    private ProductResponseDTO mapToDTO(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getImageUrl(),
                product.getCategory() != null ? product.getCategory().getName() : "",
                product.getIsActive()
        );
    }
}
