package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.UserRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.UserResponseDTO;
import com.example.VeagleSpaceTech.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok().body(userService.getAllUsers());
    }

    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PostMapping("/users")
    public ResponseEntity<UserResponseDTO> addUser(@RequestBody UserRequestDTO userRequestDTO) {
        return ResponseEntity.status(201).body(userService.addUserByAdmin(userRequestDTO));
    }

    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UserRequestDTO request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok().body(userService.deleteUser(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN','SADMIN')")
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<UserResponseDTO> updateUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }

    @PreAuthorize("hasRole('SADMIN')")
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> getSuperAdmin(@PathVariable Long id) {
        return ResponseEntity.status(200).body(userService.getAdminById(id));
    }

    @PreAuthorize("hasRole('SADMIN')")
    @PutMapping("/sadmin/{id}")
    public ResponseEntity<UserResponseDTO> updateSAdmin(@PathVariable Long id,
            @RequestBody UserRequestDTO userRequestDTO) {
        return ResponseEntity.status(200).body(userService.updateAdmin(id, userRequestDTO));
    }
}
