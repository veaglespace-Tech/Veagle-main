package com.example.VeagleSpaceTech.controller;

import com.example.VeagleSpaceTech.DTO.request.LoginRequest;
import com.example.VeagleSpaceTech.DTO.request.OtpRequest;
import com.example.VeagleSpaceTech.DTO.request.RegisterRequest;
import com.example.VeagleSpaceTech.DTO.response.AuthResponse;
import com.example.VeagleSpaceTech.DTO.response.UserResponseDTO;
import com.example.VeagleSpaceTech.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegisterRequest request) {
        UserResponseDTO response = authService.registerUser(request);
        return ResponseEntity.status(201).body(response);
    }

    // User
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.userLogin(request));
    }

    // Admin
    @PostMapping("/admin-login")
    public ResponseEntity<String> adminLogin(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.adminLogin(request));
    }
    //Super Admin
    @PostMapping("/super-admin-login")
    public ResponseEntity<String> superadminLogin(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.adminLogin(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtpRequest(request));
    }

    @PostMapping("/set-password")
    public ResponseEntity<String> setPassword(
            @RequestParam String token,
            @RequestBody String password) {
        authService.setPassword(token, password);
        return ResponseEntity.ok("Password set successfully");
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp() {
        authService.sendOtp();
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verify-user-otp")
    public ResponseEntity<String> verifyUserOtp(@RequestBody Map<String, String> request) {
        String otp = request.get("otp");
        authService.verifyOtp(otp);
        return ResponseEntity.ok("OTP verified");
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");
        authService.changePassword(newPassword);
        return ResponseEntity.ok("Password changed");
    }
}
