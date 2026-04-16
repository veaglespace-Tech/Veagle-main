package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.ChatRequestDTO;
import com.example.VeagleSpaceTech.DTO.request.ChatSupportRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ChatResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.ChatSupportResponseDTO;
import com.example.VeagleSpaceTech.service.ChatBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chatbot")
public class ChatBotController {

    @Autowired
    private ChatBotService chatBotService;

    /**
     * POST /api/v1/chatbot/chat
     * Public — no auth required.
     * Body: { "message": "..." }
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO request) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        ChatResponseDTO response = chatBotService.chat(request.getMessage().trim());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/chatbot/support
     * Public — no auth required.
     * Body: { "name": "...", "email": "...", "subject": "...", "message": "..." }
     */
    @PostMapping("/support")
    public ResponseEntity<?> support(@RequestBody ChatSupportRequestDTO request) {
        try {
            ChatSupportResponseDTO response = chatBotService.submitSupport(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
