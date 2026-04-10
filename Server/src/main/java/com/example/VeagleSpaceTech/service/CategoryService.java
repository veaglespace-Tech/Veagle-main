package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.CategoryRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.CategoryResponseDTO;
import com.example.VeagleSpaceTech.entity.Category;
import com.example.VeagleSpaceTech.repo.CategoryRepository;
import com.example.VeagleSpaceTech.repo.ProductRepo;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

	@Autowired
    private  CategoryRepository categoryRepository;

	@Autowired
    private  ProductRepo productRepo;


    // CREATE
    public CategoryResponseDTO createCategory(CategoryRequestDTO categoryRequestDTO) {

        categoryRepository.findByName(categoryRequestDTO.name())
                .ifPresent(c -> {
                    throw new RuntimeException("Category already exists");
                });

        Category category = new Category();
        category.setName(categoryRequestDTO.name());
        category.setDescription(categoryRequestDTO.description());

        Category saved = categoryRepository.save(category);

        return new CategoryResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getDescription()
        );
    }
    // GET ALL Categories
    public List<CategoryResponseDTO> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(c -> new CategoryResponseDTO(
                        c.getId(),
                        c.getName(),
                        c.getDescription()
                ))
                .toList();
    }

    // GET BY ID
    public CategoryResponseDTO getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return new CategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }

    // UPDATE
    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO dto) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

//        category.setId(id);
        if(dto.name()!=null)
            category.setName(dto.name());
        if(dto.description()!=null){
            category.setDescription(dto.description());
        }


        Category updated = categoryRepository.save(category);

        return new CategoryResponseDTO(
                updated.getId(),
                updated.getName(),
                updated.getDescription()
        );
    }


    // DELETE
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        boolean hasProducts = productRepo.existsByCategoryId(id);

        if (hasProducts) {
            throw new IllegalStateException("Cannot delete category because it contains products");
        }

        categoryRepository.delete(category);
    }

}
