package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.CategoryRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.CategoryResponseDTO;
import com.example.VeagleSpaceTech.entity.Category;
import com.example.VeagleSpaceTech.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@RequestMapping("/categories")
@RequiredArgsConstructor // if we use this then no need of @Autowire
public class CategoryController {

    private final CategoryService categoryService;

    // CREATE
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/categories")
    public ResponseEntity<CategoryResponseDTO> create(@RequestBody CategoryRequestDTO categoryRequestDTO) {
        return ResponseEntity.ok(categoryService.createCategory(categoryRequestDTO));
    }

    // GET ALL
    @GetMapping("/api/categories")
    public ResponseEntity<List<CategoryResponseDTO>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // GET BY ID
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/categories/{id}")
    public ResponseEntity<CategoryResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    // UPDATE
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/categories/{id}")
    public ResponseEntity<CategoryResponseDTO> update(
            @PathVariable Long id,
            @RequestBody CategoryRequestDTO categoryRequestDTO
    ) {
//        System.out.println("Update Category.....");
        return ResponseEntity.ok(
                categoryService.updateCategory(id, categoryRequestDTO)
        );
    }

    // DELETE
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/categories/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted");
    }


}
