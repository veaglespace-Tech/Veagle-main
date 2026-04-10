package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.repo.ClientRepository;
import org.springframework.stereotype.Service;

import com.example.VeagleSpaceTech.DTO.request.ClientRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ClientResponseDTO;
import com.example.VeagleSpaceTech.entity.Client;
import com.example.VeagleSpaceTech.mapper.ClientMapper;
import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@AllArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    // ✅ CREATE
    public ClientResponseDTO createClient(ClientRequestDTO dto, MultipartFile logo) {

        String logoUrl = uploadLogo(logo);

        Client client = ClientMapper.toEntity(dto);
        client.setLogoUrl(logoUrl);

        Client saved = clientRepository.save(client);

        return ClientMapper.toDTO(saved);
    }

    // ✅ GET ALL
    public List<ClientResponseDTO> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(ClientMapper::toDTO)
                .toList();
    }

    // ✅ GET BY ID
    public ClientResponseDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        return ClientMapper.toDTO(client);
    }

    // ✅ UPDATE
    public ClientResponseDTO updateClient(Long id, ClientRequestDTO dto, MultipartFile logo) {

        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        existing.setName(dto.name());
        existing.setWebsiteUrl(dto.websiteUrl());
        existing.setDescription(dto.description());
//        existing.setDisplayOrder(dto.displayOrder());

        // update logo if provided
        if (logo != null && !logo.isEmpty()) {
            String logoUrl = uploadLogo(logo);
            existing.setLogoUrl(logoUrl);
        }

        Client updated = clientRepository.save(existing);

        return ClientMapper.toDTO(updated);
    }

    // ✅ DELETE
    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client not found");
        }
        clientRepository.deleteById(id);
    }

    // 🔥 IMAGE UPLOAD (TEMP - same as portfolio)
    private String uploadLogo(MultipartFile logo) {
        return "http://localhost:8080/uploads/client" + logo.getOriginalFilename();
    }
}