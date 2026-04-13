package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.PortfolioRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.PortfolioResponseDTO;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;
import com.example.VeagleSpaceTech.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@AllArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;


    // ✅ GET ALL
    @GetMapping("/api/v1/portfolio")
    public ResponseEntity<List<PortfolioResponseDTO>> getAllPortfolios() {
        return ResponseEntity.ok(portfolioService.getAllPortfolios());
    }
    // ✅ GET BY ID
    @GetMapping("/api/v1/portfolio/{id}")
    public ResponseEntity<PortfolioResponseDTO> getPortfolioById(@PathVariable Long id) {
        return ResponseEntity.ok(portfolioService.getPortfolioById(id));
    }

    //  CREATE
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PostMapping("/api/v1/admin/portfolio")
    public ResponseEntity<PortfolioResponseDTO> createPortfolio(
            @ModelAttribute PortfolioRequestDTO dto,
            @RequestPart("image") MultipartFile image
    ) {
        return ResponseEntity.ok(portfolioService.createPortfolio(dto, image));
    }

    // ✅ UPDATE
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PutMapping("/api/v1/admin/portfolio/{id}")
    public ResponseEntity<PortfolioResponseDTO> updatePortfolio(
            @PathVariable Long id,
            @ModelAttribute PortfolioRequestDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        return ResponseEntity.ok(portfolioService.updatePortfolio(id, dto, image));
    }

    // ✅ DELETE
    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @DeleteMapping("/api/v1/admin/portfolio/{id}")
    public ResponseEntity<String> deletePortfolio(@PathVariable Long id) {
        portfolioService.deletePortfolio(id);
        return ResponseEntity.ok("Portfolio deleted successfully");
    }


}
