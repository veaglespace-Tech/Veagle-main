package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.entity.SiteContent;
import com.example.VeagleSpaceTech.repo.SiteContentRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SiteContentService {

    private final SiteContentRepository siteContentRepository;
    private final ObjectMapper objectMapper;

    public Map<String, Object> getSiteContent() {
        SiteContent entry = siteContentRepository.findTopByOrderByIdAsc()
                .orElseGet(this::createEmptyContentEntry);

        return readContent(entry.getContentJson());
    }

    public Map<String, Object> updateSiteContent(Map<String, Object> content) {
        SiteContent entry = siteContentRepository.findTopByOrderByIdAsc()
                .orElseGet(SiteContent::new);

        entry.setContentJson(writeContent(content));
        SiteContent saved = siteContentRepository.save(entry);
        return readContent(saved.getContentJson());
    }

    public void seedIfMissing(String contentJson) {
        if (siteContentRepository.count() > 0) {
            return;
        }

        siteContentRepository.save(
                SiteContent.builder()
                        .contentJson(contentJson)
                        .build()
        );
    }

    private SiteContent createEmptyContentEntry() {
        return siteContentRepository.save(
                SiteContent.builder()
                        .contentJson("{}")
                        .build()
        );
    }

    private Map<String, Object> readContent(String value) {
        try {
            if (value == null || value.isBlank()) {
                return new LinkedHashMap<>();
            }

            return objectMapper.readValue(value, new TypeReference<>() {});
        } catch (Exception exception) {
            throw new RuntimeException("Failed to read site content", exception);
        }
    }

    private String writeContent(Map<String, Object> value) {
        try {
            return objectMapper.writeValueAsString(value == null ? Map.of() : value);
        } catch (Exception exception) {
            throw new RuntimeException("Failed to save site content", exception);
        }
    }
}
