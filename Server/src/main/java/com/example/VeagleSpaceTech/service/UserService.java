package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.OtpData;
import com.example.VeagleSpaceTech.DTO.UpdateProfileDTO;
import com.example.VeagleSpaceTech.DTO.request.*;
import com.example.VeagleSpaceTech.DTO.response.AuthResponse;
import com.example.VeagleSpaceTech.DTO.response.UserResponseDTO;
import com.example.VeagleSpaceTech.entity.User;
import com.example.VeagleSpaceTech.enums.UserStatus;
import com.example.VeagleSpaceTech.exception.InvalidCredentialsException;
import com.example.VeagleSpaceTech.exception.ResourceNotFoundException;
import com.example.VeagleSpaceTech.exception.UserAlreadyExistsException;
import com.example.VeagleSpaceTech.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private OtpService otpService;

    @Value("${admin.secret}")
    private String ADMIN_SECRET;

    private final Map<String, OtpData> otpStore = new HashMap<>();

    public UserResponseDTO registerUser(RegisterRequest request) {
        validateUniqueUserFields(request.email(), request.contact(), null);

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setContact(request.contact());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setStatus(UserStatus.ACTIVE);
        user.setRole(normalizeRole("USER"));

        return toUserResponse(repo.save(user));
    }

    public String login(LoginRequest request) {
        User user = repo.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Email not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new RuntimeException("You are blocked.");
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

    public UserResponseDTO createAdmin(AdminCreateRequest request, String adminKey) {
        if (!ADMIN_SECRET.equals(adminKey)) {
            throw new RuntimeException("Unauthorized admin creation");
        }

        validateUniqueUserFields(request.email(), request.contact(), null);

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setContact(request.contact());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(normalizeRole("ADMIN"));
        user.setStatus(UserStatus.ACTIVE);

        return toUserResponse(repo.save(user));
    }

    public List<UserResponseDTO> getAllUsers() {
        return repo.findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    public UserResponseDTO updateUser(Long id, UserRequestDTO request) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("SADMIN".equals(normalizeRole(user.getRole()))) {
            throw new RuntimeException("Super Admin Cant Update .!!");
        }

        validateUniqueUserFields(request.email(), request.contact(), user.getId());

        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setContact(request.contact());
        user.setRole(normalizeRole(request.role()));

        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        if (request.status() != null) {
            user.setStatus(request.status());
        }

        return toUserResponse(repo.save(user));
    }

    public String deleteUser(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("SADMIN".equals(normalizeRole(user.getRole()))) {
            throw new RuntimeException("Super Admin Cant Delete ..!!");
        }

        repo.delete(user);
        return "Deleted...";
    }

    public UserResponseDTO addUserByAdmin(UserRequestDTO request) {
        String role = normalizeRole(request.role());

        if ("SADMIN".equals(role)) {
            throw new RuntimeException("Super Admin Cant Create By Admins");
        }

        validateUniqueUserFields(request.email(), request.contact(), null);

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setContact(request.contact());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setStatus(request.status() != null ? request.status() : UserStatus.ACTIVE);

        return toUserResponse(repo.save(user));
    }

    public UserResponseDTO toggleUserStatus(Long id) {
        User targetUser = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();

        User currentUser = repo.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("Logged in user not found"));

        if ("SADMIN".equals(normalizeRole(targetUser.getRole()))
                && !"SADMIN".equals(normalizeRole(currentUser.getRole()))) {
            throw new RuntimeException("You cannot block Super Admin");
        }

        if (targetUser.getStatus() == UserStatus.ACTIVE) {
            targetUser.setStatus(UserStatus.BLOCKED);
        } else {
            targetUser.setStatus(UserStatus.ACTIVE);
        }

        return toUserResponse(repo.save(targetUser));
    }

    public UserResponseDTO getAdminById(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return toUserResponse(user);
    }

    public UserResponseDTO updateAdmin(Long id, UserRequestDTO request) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateUniqueUserFields(request.email(), request.contact(), user.getId());

        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setContact(request.contact());
        user.setRole(normalizeRole(request.role()));

        if (request.status() != null) {
            user.setStatus(request.status());
        }

        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        return toUserResponse(repo.save(user));
    }

    public UserResponseDTO getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return toUserResponse(user);
    }

    public UserResponseDTO updateProfile(UpdateProfileDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.username() != null) {
            user.setUsername(dto.username());
        }

        if (dto.contact() != null) {
            validateUniqueUserFields(user.getEmail(), dto.contact(), user.getId());
            user.setContact(dto.contact());
        }

        return toUserResponse(repo.save(user));
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
