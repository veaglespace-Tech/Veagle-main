package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.ChatRequestDTO;
import com.example.VeagleSpaceTech.DTO.request.ChatSupportRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ChatResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.ChatSupportResponseDTO;
import com.example.VeagleSpaceTech.service.ChatBotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/chatbot")
@RequiredArgsConstructor
public class ChatBotController {

    private final ChatBotService chatBotService;

    /**
     * POST /api/public/chatbot/chat
     * Public — no auth required.
     * Body: { "message": "..." }
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(
            @RequestBody ChatRequestDTO request,
            @RequestHeader(name = "X-Chatbot-Logged-In", required = false) String loggedInHeader,
            Authentication authentication
    ) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        boolean authenticatedUser = authentication != null
            && authentication.isAuthenticated()
            && authentication.getName() != null
            && !"anonymousUser".equalsIgnoreCase(authentication.getName());
        boolean loggedIn = authenticatedUser || Boolean.parseBoolean(loggedInHeader);

        ChatResponseDTO response = chatBotService.chat(request.getMessage().trim(), loggedIn);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/public/chatbot/support
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

    /** Get All  Chats Supports
     **/
//    @GetMapping("/api/admin/chat")
//    public ResponseEntity<List<ChatSupportTicket>> getAllChats(){
//        return ResponseEntity.status(200).body(chatBotService.getAllChats());
//    }




}
