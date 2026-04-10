package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRepository extends JpaRepository<Portfolio,Long> {
}
