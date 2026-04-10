package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.mapper.PortfolioMapper;
import com.example.VeagleSpaceTech.repo.PortfolioRepository;
import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.VeagleSpaceTech.DTO.request.PortfolioRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.PortfolioResponseDTO;
import com.example.VeagleSpaceTech.entity.Portfolio;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@AllArgsConstructor
public class PortfolioService {

	@Autowired
    private PortfolioRepository portfolioRepository;

    // ✅ CREATE
    public PortfolioResponseDTO createPortfolio(PortfolioRequestDTO dto, MultipartFile image) {

        String imageUrl = uploadImage(image);

        Portfolio portfolio = PortfolioMapper.toEntity(dto);
        portfolio.setImageUrl(imageUrl);

        Portfolio saved = portfolioRepository.save(portfolio);

        return PortfolioMapper.toDTO(saved);
    }

    //  GET ALL
    public List<PortfolioResponseDTO> getAllPortfolios() {
        return portfolioRepository.findAll()
                .stream()
                .map(PortfolioMapper::toDTO)
                .toList();
    }

    //  GET BY ID
    public PortfolioResponseDTO getPortfolioById(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        return PortfolioMapper.toDTO(portfolio);
    }

    //  UPDATE
    public PortfolioResponseDTO updatePortfolio(Long id, PortfolioRequestDTO dto, MultipartFile image) {

        Portfolio existing = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        existing.setTitle(dto.title());
        existing.setDescription(dto.description());
        existing.setProjectUrl(dto.projectUrl());
        existing.setGithubUrl(dto.githubUrl());

        if (image != null && !image.isEmpty()) {
            String imageUrl = uploadImage(image);
            existing.setImageUrl(imageUrl);
        }

        Portfolio updated = portfolioRepository.save(existing);

        return PortfolioMapper.toDTO(updated);
    }

    // ✅ DELETE
    public void deletePortfolio(Long id) {
        if (!portfolioRepository.existsById(id)) {
            throw new RuntimeException("Portfolio not found");
        }
        portfolioRepository.deleteById(id);
    }

    // IMAGE UPLOAD (TEMP)
    private String uploadImage(MultipartFile image) {
        return "http://localhost:8080/uploads/portfolio" + image.getOriginalFilename();
    }
}