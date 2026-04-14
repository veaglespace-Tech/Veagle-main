package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ORG_ServicesRepo extends JpaRepository<Services,Long> {

    List<Services> findByTitleContainingIgnoreCase(String title);
}
