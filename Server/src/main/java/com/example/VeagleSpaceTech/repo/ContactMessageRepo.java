package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepo extends JpaRepository<ContactMessage,Long> {
    List<ContactMessage> findByIsReadFalse();
}
