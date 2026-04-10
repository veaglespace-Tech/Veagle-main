package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.entity.PortalLead;
import com.example.VeagleSpaceTech.entity.User;
import com.example.VeagleSpaceTech.repo.PortalLeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PortalLeadService {

    private final PortalLeadRepository portalLeadRepository;

    public List<PortalLead> getAllLeads() {
        return portalLeadRepository.findAllByOrderByCreatedAtDesc();
    }

    public PortalLead createLead(Map<String, Object> body, User user) {
        String status = readText(body.get("status"));
        String source = readText(body.get("source"));
        String name = readText(body.get("name"));
        String email = readText(body.get("email"));
        String phone = readText(body.get("phone"));

        PortalLead lead = PortalLead.builder()
                .name(name.isBlank() && user != null ? user.getUsername() : name)
                .company(readText(body.get("company")))
                .email(email.isBlank() && user != null ? user.getEmail() : email)
                .phone(phone.isBlank() && user != null ? user.getContact() : phone)
                .serviceInterest(readText(body.get("serviceInterest")))
                .budget(readText(body.get("budget")))
                .timeline(readText(body.get("timeline")))
                .message(readText(body.get("message")))
                .status(status.isBlank() ? "new" : status)
                .source(source.isBlank() ? (user != null ? "website-user" : "website") : source)
                .user(user)
                .build();

        return portalLeadRepository.save(lead);
    }

    public PortalLead updateLead(Long id, Map<String, Object> updates) {
        PortalLead lead = portalLeadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        if (updates.containsKey("status")) {
            lead.setStatus(readText(updates.get("status")));
        }

        if (updates.containsKey("source")) {
            lead.setSource(readText(updates.get("source")));
        }

        return portalLeadRepository.save(lead);
    }

    private String readText(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }
}
