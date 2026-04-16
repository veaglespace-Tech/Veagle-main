package com.example.VeagleSpaceTech.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatResponseDTO {
    private String answer;
    private String confidence;
    private boolean showForm;
}
