package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.PortalTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortalTaskRepository extends JpaRepository<PortalTask, Long> {
    List<PortalTask> findAllByOrderByUpdatedAtDesc();
}
