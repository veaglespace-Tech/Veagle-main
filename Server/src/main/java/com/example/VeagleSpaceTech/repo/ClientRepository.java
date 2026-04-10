package com.example.VeagleSpaceTech.repo;


import com.example.VeagleSpaceTech.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}