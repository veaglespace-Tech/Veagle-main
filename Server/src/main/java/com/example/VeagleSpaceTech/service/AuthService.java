package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.OtpData;
import com.example.VeagleSpaceTech.DTO.request.LoginRequest;
import com.example.VeagleSpaceTech.DTO.request.OtpRequest;
import com.example.VeagleSpaceTech.DTO.request.RegisterRequest;
import com.example.VeagleSpaceTech.DTO.response.AuthResponse;
import com.example.VeagleSpaceTech.DTO.response.UserResponseDTO;
import com.example.VeagleSpaceTech.entity.User;
import com.example.VeagleSpaceTech.enums.UserStatus;
import com.example.VeagleSpaceTech.exception.InvalidCredentialsException;
import com.example.VeagleSpaceTech.exception.ResourceNotFoundException;
import com.example.VeagleSpaceTech.exception.UserAlreadyExistsException;
import com.example.VeagleSpaceTech.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo repo;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;

    private final Map<String, OtpData> otpStore = new HashMap<>();

    public UserResponseDTO registerUser(RegisterRequest request) {
        validateUniqueUserFields(request.email(), request.contact(), null);

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setContact(request.contact());

        // change this
        user.setStatus(UserStatus.PENDING);

        user.setRole(normalizeRole("USER"));

        // generate token
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusMinutes(30));

        User savedUser = repo.save(user);

        // send email with link
        try {
            emailService.sendSetPasswordLink(savedUser.getEmail(), token);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification email  " + e);
        }

        return toUserResponse(savedUser);
    }

    public void setPassword(String token, String newPassword) {

        User user = repo.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired. Please request a new link.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setStatus(UserStatus.ACTIVE);

        // remove token
        user.setVerificationToken(null);
        user.setTokenExpiry(null);

        repo.save(user);
    }

    public String adminLogin(LoginRequest request) {

        User user = repo.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Email not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new RuntimeException("You are blocked.");
        }

        if (user.getRole().equals("USER")) {
            // Send Token to User
            throw new RuntimeException("User Cant Login Here...");
        }

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        otpService.saveOtp(user.getEmail(), otp);

        try {
            emailService.sendOtp(user.getEmail(), otp);
            System.out.println("\nOTP sent to email: " + user.getEmail());
            return "OTP sent successfully";
        } catch (Exception exception) {
            System.out.println("\n\nFailed to send OTP email: " + exception);
            return "OTP generated. Email service unavailable right now. DEV OTP: ";
        }

    }

    public AuthResponse verifyOtpRequest(OtpRequest request) {

        boolean isValid = otpService.verifyOtp(request.email(), request.otp());

        if (!isValid) {
            throw new RuntimeException("Invalid or Expired OTP");
        }

        User user = repo.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String normalizedRole = normalizeRole(user.getRole());
        String token = jwtService.generateToken(user.getEmail(), normalizedRole);

        System.out.println("\n\nNormalization");
        System.out.println(normalizedRole + "   \nToken : " + token);

        return new AuthResponse(
                user.getId(),
                token,
                normalizedRole,
                user.getEmail(),
                user.getUsername(),
                user.getContact());

    }

    public void sendOtp() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(2);

        otpStore.put(email, new OtpData(otp, expiry, false));

        String message = "Dear User,\n\n"
                + "Your One-Time Password (OTP) for verification is: " + otp + "\n\n"
                + "This OTP is valid for 2 minutes.\n"
                + "Please do not share this OTP with anyone.\n\n"
                + "If you did not request this, please ignore this email.\n\n"
                + "Regards,\n"
                + "VeagleSpace Team";

//        emailService.sendEmail(email, "OTP Verification - VeagleSpace", message);
        emailService.sendOtp(email, otp);


    }

    public void verifyOtp(String inputOtp) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        OtpData data = otpStore.get(email);

        if (data == null) {
            throw new RuntimeException("OTP not found");
        }

        if (data.expiryTime().isBefore(LocalDateTime.now())) {
            otpStore.remove(email);
            throw new RuntimeException("OTP expired");
        }

        if (!data.otp().equals(inputOtp)) {
            throw new RuntimeException("Invalid OTP");
        }
        otpStore.put(email, new OtpData(data.otp(), data.expiryTime(), true));
    }

    public void changePassword(String newPassword) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        OtpData data = otpStore.get(email);

        if (data == null || !data.verified()) {
            throw new RuntimeException("OTP not verified");
        }

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        repo.save(user);
        otpStore.remove(email);
    }

    public AuthResponse userLogin(LoginRequest request) {

        User user = repo.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Password check (MANDATORY)
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        // Status check
        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new RuntimeException("You are blocked.");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Account not active");
        }

        String normalizedRole = normalizeRole(user.getRole());

        // Extra safety: ensure only USER hits this API
        if (!normalizedRole.equals("USER")) {
            throw new RuntimeException("This endpoint is only for users");
        }

        String token = jwtService.generateToken(user.getEmail(), normalizedRole);

        return new AuthResponse(
                user.getId(),
                token,
                normalizedRole,
                user.getEmail(),
                user.getUsername(),
                user.getContact()
        );
    }

    private void validateUniqueUserFields(String email, String contact, Long currentUserId) {
        repo.findByEmail(email)
                .filter(user -> !user.getId().equals(currentUserId))
                .ifPresent(user -> {
                    throw new UserAlreadyExistsException("Email already exists");
                });

        if (contact == null || contact.isBlank()) {
            return;
        }

        repo.findAll().stream()
                .filter(user -> user.getContact() != null && user.getContact().equals(contact))
                .filter(user -> !user.getId().equals(currentUserId))
                .findFirst()
                .ifPresent(user -> {
                    throw new UserAlreadyExistsException("Phone No. already exists");
                });
    }

    private UserResponseDTO toUserResponse(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getContact(),
                normalizeRole(user.getRole()),
                user.getStatus());
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "USER";
        }

        return role.replaceFirst("^ROLE_", "").toUpperCase();
    }
}
