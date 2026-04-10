package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.LoginRequest;
import com.example.VeagleSpaceTech.DTO.request.RegisterRequest;
import com.example.VeagleSpaceTech.DTO.response.AuthResponse;
import com.example.VeagleSpaceTech.DTO.response.UserResponseDTO;
import com.example.VeagleSpaceTech.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Register User
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(201)
                .body(userService.registerUser(request));
    }

    // ✅ Login User
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }




}