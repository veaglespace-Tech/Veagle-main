package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.PortfolioRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.PortfolioResponseDTO;
import com.example.VeagleSpaceTech.entity.Portfolio;
import com.example.VeagleSpaceTech.mapper.PortfolioMapper;
import com.example.VeagleSpaceTech.repo.PortfolioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@AllArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final FileService fileService;

    public PortfolioResponseDTO createPortfolio(PortfolioRequestDTO dto, MultipartFile image) {
        String imageUrl = uploadImage(image);

        Portfolio portfolio = PortfolioMapper.toEntity(dto);
        portfolio.setImageUrl(imageUrl);

        return PortfolioMapper.toDTO(portfolioRepository.save(portfolio));
    }

    public List<PortfolioResponseDTO> getAllPortfolios() {
        return portfolioRepository.findAll()
                .stream()
                .map(PortfolioMapper::toDTO)
                .toList();
    }

    public PortfolioResponseDTO getPortfolioById(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        return PortfolioMapper.toDTO(portfolio);
    }

    public PortfolioResponseDTO updatePortfolio(Long id, PortfolioRequestDTO dto, MultipartFile image) {
        Portfolio existing = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        existing.setTitle(dto.title());
        existing.setDescription(dto.description());
        existing.setProjectUrl(dto.projectUrl());
        existing.setGithubUrl(dto.githubUrl());

        if (image != null && !image.isEmpty()) {
            fileService.delete(existing.getImageUrl());
            existing.setImageUrl(uploadImage(image));
        }

        return PortfolioMapper.toDTO(portfolioRepository.save(existing));
    }

    public void deletePortfolio(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        portfolioRepository.delete(portfolio);
        fileService.delete(portfolio.getImageUrl());
    }

    private String uploadImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new RuntimeException("Portfolio image is required");
        }

        return fileService.uploadImage(image, "portfolio");
    }
}
