package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.CategoryRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.CategoryResponseDTO;
import com.example.VeagleSpaceTech.service.CategoryService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // GET ALL
    @GetMapping("/api/public/categories")
    public ResponseEntity<List<CategoryResponseDTO>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // GET BY ID
    @GetMapping("/api/public/categories/{id}")
    public ResponseEntity<CategoryResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    // CREATE
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PostMapping("/api/admin/categories")
    public ResponseEntity<CategoryResponseDTO> create(@RequestBody CategoryRequestDTO categoryRequestDTO) {
        return ResponseEntity.ok(categoryService.createCategory(categoryRequestDTO));
    }

    // UPDATE
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PutMapping("/api/admin/categories/{id}")
    public ResponseEntity<CategoryResponseDTO> update(
            @PathVariable Long id,
            @RequestBody CategoryRequestDTO categoryRequestDTO) {
        System.out.println("\nUpdate Category.....Name: " + categoryRequestDTO.name() + "  Discription: "
                + categoryRequestDTO.description());
        return ResponseEntity.ok(
                categoryService.updateCategory(id, categoryRequestDTO));
    }

    // DELETE
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @DeleteMapping("/api/admin/categories/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted");
    }

}
