package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.ClientRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ClientResponseDTO;
import com.example.VeagleSpaceTech.entity.Client;
import com.example.VeagleSpaceTech.mapper.ClientMapper;
import com.example.VeagleSpaceTech.repo.ClientRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@AllArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final FileService fileService;

    public ClientResponseDTO createClient(ClientRequestDTO dto, MultipartFile logo) {
        String logoUrl = uploadLogo(logo);

        Client client = ClientMapper.toEntity(dto);
        client.setLogoUrl(logoUrl);

        return ClientMapper.toDTO(clientRepository.save(client));
    }

    public List<ClientResponseDTO> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(ClientMapper::toDTO)
                .toList();
    }

    public ClientResponseDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        return ClientMapper.toDTO(client);
    }

    public ClientResponseDTO updateClient(Long id, ClientRequestDTO dto, MultipartFile logo) {
        Client existing = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        existing.setName(dto.name());
        existing.setWebsiteUrl(dto.websiteUrl());
        existing.setDescription(dto.description());

        if (logo != null && !logo.isEmpty()) {
            fileService.delete(existing.getLogoUrl());
            existing.setLogoUrl(uploadLogo(logo));
        }

        return ClientMapper.toDTO(clientRepository.save(existing));
    }

    public void deleteClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        clientRepository.delete(client);
        fileService.delete(client.getLogoUrl());
    }

    private String uploadLogo(MultipartFile logo) {
        if (logo == null || logo.isEmpty()) {
            throw new RuntimeException("Client logo is required");
        }

        return fileService.uploadImage(logo, "clients");
    }
}
