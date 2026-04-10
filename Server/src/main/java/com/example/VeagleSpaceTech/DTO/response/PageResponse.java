package com.example.VeagleSpaceTech.DTO.response;

import java.util.List;

public record PageResponse<T>(
        List<T> data,
        int totalPages,
        long totalElements,
        int currentPage
) {}