package com.example.VeagleSpaceTech.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatSupportResponseDTO {
    private boolean success;
    private Long ticketId;
    private String message;
}
