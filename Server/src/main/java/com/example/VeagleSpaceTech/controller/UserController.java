package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.UpdateProfileDTO;
import com.example.VeagleSpaceTech.DTO.request.LoginRequest;
import com.example.VeagleSpaceTech.DTO.request.RegisterRequest;
import com.example.VeagleSpaceTech.DTO.response.AuthResponse;
import com.example.VeagleSpaceTech.DTO.response.UserResponseDTO;
import com.example.VeagleSpaceTech.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Register User
    @PostMapping("/api/v1/auth/register") ///api/v1/auth/register
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(201)
                .body(userService.registerUser(request));
    }

    //  Login User
    @PostMapping("/api/v1/auth/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    // Profile

    @GetMapping("/api/v1/users/profile")
    public ResponseEntity<UserResponseDTO> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    // ✅ PATCH PROFILE (partial update)
    @PutMapping("/api/v1/users/profile")
    public ResponseEntity<UserResponseDTO> updateProfile(@RequestBody UpdateProfileDTO dto) {
        return ResponseEntity.ok(userService.updateProfile(dto));
    }

    //for password changing

    @PostMapping("/api/v1/auth/send-otp")
    public ResponseEntity<String> sendOtp() {
        userService.sendOtp();
        return ResponseEntity.ok("OTP sent successfully");
    }

    // Verify Otp
    @PostMapping("/api/v1/auth/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        String otp = request.get("otp");
        userService.verifyOtp(otp);
        return ResponseEntity.ok("OTP verified");
    }

    // Change Password
    @PutMapping("/api/v1/auth/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> request) {

        String newPassword = request.get("newPassword");
        userService.changePassword(newPassword);

        return ResponseEntity.ok("Password changed");
    }



}