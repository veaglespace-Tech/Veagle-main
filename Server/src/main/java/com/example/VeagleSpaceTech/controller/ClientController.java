package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.service.ClientService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;
import com.example.VeagleSpaceTech.DTO.request.ClientRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ClientResponseDTO;
import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@AllArgsConstructor
public class ClientController {

		@Autowired
    private ClientService clientService;



    // ✅ GET ALL (PUBLIC)
    @GetMapping("/api/v1/clients")
    public ResponseEntity<List<ClientResponseDTO>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    // ✅ GET BY ID (PUBLIC)
    @GetMapping("/api/v1/clients/{id}")
    public ResponseEntity<ClientResponseDTO> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    // ✅ CREATE (ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PostMapping("/api/v1/admin/clients")
    public ResponseEntity<ClientResponseDTO> createClient(
            @ModelAttribute ClientRequestDTO dto,
            @RequestPart("logo") MultipartFile logo
    ) {
        return ResponseEntity.ok(clientService.createClient(dto, logo));
    }

    // ✅ UPDATE (ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PutMapping("/api/v1/admin/clients/{id}")
    public ResponseEntity<ClientResponseDTO> updateClient(
            @PathVariable Long id,
            @ModelAttribute ClientRequestDTO dto,
            @RequestPart(value = "logo", required = false) MultipartFile logo
    ) {
        return ResponseEntity.ok(clientService.updateClient(id, dto, logo));
    }

    //  DELETE (ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @DeleteMapping("/api/v1/admin/clients/{id}")
    public ResponseEntity<String> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok("Client deleted successfully");
    }

    
}
