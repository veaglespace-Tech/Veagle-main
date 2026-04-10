package com.example.VeagleSpaceTech.controller;


import com.example.VeagleSpaceTech.DTO.request.ContactRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ContactResponseDTO;
import com.example.VeagleSpaceTech.service.ContactMessageService;
import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class ContactMessageController {

		@Autowired
    private  ContactMessageService service;


    // Add Messages By Users
    @PostMapping("/api/v1/contacts")
    public ResponseEntity<String> contact(@RequestBody ContactRequestDTO request){
        service.addContactMessage(request);
        return ResponseEntity.ok("Saved...");
    }

    // Get All Messages
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/v1/admin/contacts")
    public ResponseEntity<List<ContactResponseDTO>> getContactMessages(){
        return ResponseEntity.status(200).body(service.getContactMessages());
    }
    // Fetch Only for Read or Not Read
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/v1/admin/contacts/unread")
    public ResponseEntity<List<ContactResponseDTO>> getUnreadContactMessages(){
        return ResponseEntity.status(200).body(service.getUnreadContactMessages());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/api/v1/admin/contacts/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long id){

        service.markAsRead(id);

        return ResponseEntity.ok("Marked as read");
    }

    // Delete Messages
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/api/v1/admin/contacts/{id}")
    public ResponseEntity<String> deleteContactMessages(@PathVariable Long id){
        service.deleteContactMessage(id);
        return ResponseEntity.ok("Deleted...");
    }


}
