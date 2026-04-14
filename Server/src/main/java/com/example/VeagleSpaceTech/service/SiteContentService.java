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
    private static final String DEPRECATED_UNIVERSITY_KEY = "university";
    private static final TypeReference<LinkedHashMap<String, Object>> CONTENT_TYPE = new TypeReference<>() {
    };

    private final SiteContentRepository siteContentRepository;
    private final ObjectMapper objectMapper;

    public Map<String, Object> getContent() {
        return siteContentRepository.findByContentKey(PRIMARY_CONTENT_KEY)
                .map(this::loadSanitizedContent)
                .orElseGet(LinkedHashMap::new);
    }

    public Map<String, Object> saveContent(Map<String, Object> content) {
        SiteContent siteContent = siteContentRepository.findByContentKey(PRIMARY_CONTENT_KEY)
                .orElseGet(() -> SiteContent.builder().contentKey(PRIMARY_CONTENT_KEY).build());

        Map<String, Object> nextContent = sanitizeContent(content);

        siteContent.setPayload(serialize(nextContent));
        siteContentRepository.save(siteContent);
        return nextContent;
    }

    private LinkedHashMap<String, Object> sanitizeContent(Map<String, Object> content) {
        LinkedHashMap<String, Object> nextContent =
                content == null ? new LinkedHashMap<>() : new LinkedHashMap<>(content);
        nextContent.remove(DEPRECATED_UNIVERSITY_KEY);
        return nextContent;
    }

    private LinkedHashMap<String, Object> loadSanitizedContent(SiteContent siteContent) {
        LinkedHashMap<String, Object> storedContent = deserialize(siteContent.getPayload());
        LinkedHashMap<String, Object> sanitizedContent = sanitizeContent(storedContent);
        if (sanitizedContent.size() != storedContent.size()) {
            siteContent.setPayload(serialize(sanitizedContent));
            siteContentRepository.save(siteContent);
        }
        return sanitizedContent;
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
