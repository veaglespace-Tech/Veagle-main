package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.entity.PortalLead;
import com.example.VeagleSpaceTech.entity.User;
import com.example.VeagleSpaceTech.model.UserPrincipal;
import com.example.VeagleSpaceTech.service.PortalLeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
public class PortalLeadController {

    private final PortalLeadService portalLeadService;

    @PostMapping("/api/leads")
    public ResponseEntity<PortalLead> createLead(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        User user = principal != null ? principal.getUser() : null;
        return ResponseEntity.status(201).body(portalLeadService.createLead(body, user));
    }

    @GetMapping("/admin/leads")
    public ResponseEntity<List<PortalLead>> getLeads() {
        return ResponseEntity.ok(portalLeadService.getAllLeads());
    }

    @PatchMapping("/admin/leads/{id}")
    public ResponseEntity<PortalLead> updateLead(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates
    ) {
        return ResponseEntity.ok(portalLeadService.updateLead(id, updates));
    }
}
