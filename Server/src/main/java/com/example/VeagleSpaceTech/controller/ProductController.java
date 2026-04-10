package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.ProductRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ProductResponseDTO;
import com.example.VeagleSpaceTech.service.ProductsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductsService productsService;

    // Fetch All Products
    @GetMapping("/api/products")
    public ResponseEntity<List<ProductResponseDTO>> getProducts() {
        return ResponseEntity.status(200).body(productsService.getAllProducts());
    }

    //Add Product
    @PostMapping(value = "/admin/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> addProduct(
            @RequestPart("request") String requestJson,
            @RequestPart("file") MultipartFile file
    ) {
        ObjectMapper objectMapper = new ObjectMapper();
        ProductRequestDTO request;

        try {
            request = objectMapper.readValue(requestJson, ProductRequestDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid request data");
        }

        return ResponseEntity.status(201).body(productsService.addProduct(request, file));
    }

    // Update Product
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/admin/products/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @RequestPart("request") String requestJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            ProductRequestDTO dto = mapper.readValue(requestJson, ProductRequestDTO.class);

            ProductResponseDTO response = productsService.updateProduct(id, dto, file);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            throw new RuntimeException("Failed to update product: " + e.getMessage());
        }
    }

    // For only Status Updation
    @PutMapping("/admin/products/status/{id}")
    public ResponseEntity<String> updateProductStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request
    ) {
        Boolean isActive = request.get("isActive");
        productsService.updateProductStatus(id, isActive);
        return ResponseEntity.ok("Status updated successfully");
    }

    // Delete Product
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id){
        return ResponseEntity.ok(productsService.deleteProduct(id));
    }


}
