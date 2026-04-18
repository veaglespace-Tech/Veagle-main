package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.service.SiteContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SiteContentController {

    private final SiteContentService siteContentService;

    @GetMapping("/api/public/site-content")
    public ResponseEntity<Map<String, Object>> getContent() {
        return ResponseEntity.ok(siteContentService.getContent());
    }

    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PutMapping("/api/admin/site-content")
    public ResponseEntity<Map<String, Object>> updateContent(@RequestBody Map<String, Object> content) {
        return ResponseEntity.ok(siteContentService.saveContent(content));
    }
}
