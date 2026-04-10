package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {

    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);

    boolean existsByCategoryId(Long categoryId);
}
