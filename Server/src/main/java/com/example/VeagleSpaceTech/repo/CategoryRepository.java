package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.Category;
import com.example.VeagleSpaceTech.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
//    Optional<Category> findByName(String name);
//    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);

    Optional<Category> findByName(String name);
}