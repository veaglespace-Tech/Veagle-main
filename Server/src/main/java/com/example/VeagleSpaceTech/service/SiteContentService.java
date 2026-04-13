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

    private static final String PRIMARY_CONTENT_KEY = "PRIMARY_SITE_CONTENT";
    private static final TypeReference<LinkedHashMap<String, Object>> CONTENT_TYPE = new TypeReference<>() {
    };

    private final SiteContentRepository siteContentRepository;
    private final ObjectMapper objectMapper;

    public Map<String, Object> getContent() {
        return siteContentRepository.findByContentKey(PRIMARY_CONTENT_KEY)
                .map(SiteContent::getPayload)
                .map(this::deserialize)
                .orElseGet(LinkedHashMap::new);
    }

    public Map<String, Object> saveContent(Map<String, Object> content) {
        SiteContent siteContent = siteContentRepository.findByContentKey(PRIMARY_CONTENT_KEY)
                .orElseGet(() -> SiteContent.builder().contentKey(PRIMARY_CONTENT_KEY).build());

        Map<String, Object> nextContent =
                content == null ? new LinkedHashMap<>() : new LinkedHashMap<>(content);

        siteContent.setPayload(serialize(nextContent));
        siteContentRepository.save(siteContent);
        return nextContent;
    }

    private LinkedHashMap<String, Object> deserialize(String payload) {
        if (payload == null || payload.isBlank()) {
            return new LinkedHashMap<>();
        }

        try {
            return objectMapper.readValue(payload, CONTENT_TYPE);
        } catch (Exception exception) {
            throw new RuntimeException("Unable to read site content payload", exception);
        }
    }

    private String serialize(Map<String, Object> content) {
        try {
            return objectMapper.writeValueAsString(content);
        } catch (Exception exception) {
            throw new RuntimeException("Unable to save site content payload", exception);
        }
    }
}
