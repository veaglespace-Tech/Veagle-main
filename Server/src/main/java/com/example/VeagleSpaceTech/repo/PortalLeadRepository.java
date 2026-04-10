package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.PortalLead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortalLeadRepository extends JpaRepository<PortalLead, Long> {
    List<PortalLead> findAllByOrderByCreatedAtDesc();
}
