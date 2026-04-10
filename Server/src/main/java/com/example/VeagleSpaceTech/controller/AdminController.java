package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.response.UserResponseDTO;
import com.example.VeagleSpaceTech.DTO.request.AdminCreateRequest;
import com.example.VeagleSpaceTech.DTO.request.UserRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.AuthResponse;
import com.example.VeagleSpaceTech.DTO.request.LoginRequest;
import com.example.VeagleSpaceTech.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AdminController {

    @Autowired
    private UserService userService;

    //  Create Admin (with secret key)
//    @PostMapping("/auth/register")
//    public ResponseEntity<com.example.VeagleSpaceTech.DTO.response.UserResponseDTO> createAdmin(
//           @Valid @RequestBody AdminCreateRequest request,
//            @RequestHeader("X-ADMIN-KEY") String adminKey
//    ) {
//        return ResponseEntity.status(201).body(userService.createAdmin(request, adminKey));
//    }

    // Login Admin
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));

    }

    //  Users Related Oprations

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers(){
        return ResponseEntity.ok().body(userService.getAllUsers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/users/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UserRequestDTO request
    ) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        return ResponseEntity.ok().body(userService.deleteUser(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/users")
    public ResponseEntity<UserResponseDTO> addUser(@RequestBody UserRequestDTO userRequestDTO){
        return ResponseEntity.status(201).body(userService.addUserByAdmin(userRequestDTO));
    }

    // Status Updating
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/users/{id}/status")
    public ResponseEntity<UserResponseDTO> updateUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }


    // Get User Or Admin
    @PreAuthorize("hasRole('SADMIN')")
    @GetMapping("/admin/{id}")
    public ResponseEntity<UserResponseDTO> getSuperAdmin(@PathVariable Long id){
        return ResponseEntity.status(200).body(userService.getAdminById(id));
    }
    //  Update Super Admin data
    @PreAuthorize("hasRole('SADMIN')")
    @PutMapping("/sadmin/{id}")
    public ResponseEntity<UserResponseDTO> updateSAdmin(@PathVariable Long id,@RequestBody UserRequestDTO userRequestDTO){
        return ResponseEntity.status(200).body(userService.updateAdmin(id,userRequestDTO));
    }

 // Apis


}
