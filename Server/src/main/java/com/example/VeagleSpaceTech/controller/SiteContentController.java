package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.service.SiteContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
public class SiteContentController {

    private final SiteContentService siteContentService;

    @GetMapping("/api/site-content")
    public ResponseEntity<Map<String, Object>> getPublicSiteContent() {
        return ResponseEntity.ok(siteContentService.getSiteContent());
    }

    @GetMapping("/admin/site-content")
    public ResponseEntity<Map<String, Object>> getAdminSiteContent() {
        return ResponseEntity.ok(siteContentService.getSiteContent());
    }

    @PutMapping("/admin/site-content")
    public ResponseEntity<Map<String, Object>> updateSiteContent(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(siteContentService.updateSiteContent(body));
    }
}
