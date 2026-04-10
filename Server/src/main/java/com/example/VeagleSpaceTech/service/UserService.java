package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.OtpData;
import com.example.VeagleSpaceTech.DTO.UpdateProfileDTO;
import com.example.VeagleSpaceTech.DTO.request.*;
import com.example.VeagleSpaceTech.DTO.response.UserResponseDTO;
import com.example.VeagleSpaceTech.DTO.response.AuthResponse;
import com.example.VeagleSpaceTech.entity.User;
import com.example.VeagleSpaceTech.enums.UserStatus;
import com.example.VeagleSpaceTech.exception.InvalidCredentialsException;
import com.example.VeagleSpaceTech.exception.ResourceNotFoundException;
import com.example.VeagleSpaceTech.exception.UserAlreadyExistsException;
import com.example.VeagleSpaceTech.repo.UserRepo;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    private EmailService emailService; // for send Email

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private OtpService otpService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);


    //  Save User
    public com.example.VeagleSpaceTech.DTO.response.UserResponseDTO registerUser(RegisterRequest request) {

        if (repo.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException("Email already exists");
        }
        else if (repo.existsByContact(request.contact())) {
            throw new UserAlreadyExistsException("Phone No. already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setContact(request.contact());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setStatus(UserStatus.ACTIVE);

        // IMPORTANT
        user.setRole("USER");

        User saved = repo.save(user);

        return new UserResponseDTO(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getContact(),
                saved.getRole(),
                saved.getStatus()
        );
    }

 // User Admin Login
     public String login(LoginRequest request) {

     User user = repo.findByEmail(request.email())
             .orElseThrow(() -> new ResourceNotFoundException("Email not found"));

     if (!passwordEncoder.matches(request.password(), user.getPassword())) {
         throw new InvalidCredentialsException("Invalid password");
     }
     if (user.getStatus().equals("BLOCKED")) {
         throw new RuntimeException("You Are Blocked...");
     }
     // generate OTP
     String otp = String.valueOf(new Random().nextInt(900000) + 100000);

     otpService.saveOtp(user.getEmail(), otp);

     emailService.sendOtp(user.getEmail(), otp);

     return "OTP sent successfully";
 }


  // Verify Otp
  public AuthResponse verifyOtpRequest(OtpRequest request) {

      boolean isValid = otpService.verifyOtp(request.email(), request.otp());

      if (!isValid) {
          throw new RuntimeException("Invalid or Expired OTP");
      }

      User user = repo.findByEmail(request.email())
              .orElseThrow(() -> new ResourceNotFoundException("User not found"));

      String token = jwtService.generateToken(user.getEmail(), user.getRole());

      return new AuthResponse(
              user.getId(),
              token,
              user.getRole(),   // Role
              user.getEmail()
      );
  }

  // Admin Registration
    @Value("${admin.secret}")
    private String ADMIN_SECRET;

    public UserResponseDTO createAdmin(AdminCreateRequest request, String adminKey) {

        //    System.out.println("\n from server  "+ADMIN_SECRET+"\t"+" From Frontend    "+adminKey+"\n");
        // Validate secret
        if (!ADMIN_SECRET.equals(adminKey)) {
            throw new RuntimeException("Unauthorized admin creation");
        }

        //  Limit admins
//        long count = repo.countByRole("ADMIN");
//        if (count >= 2) {
//            throw new RuntimeException("Only 2 admins allowed");
//        }

        if (repo.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setContact(request.contact());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("ROLE_ADMIN");

        User saved = repo.save(user);

        return new com.example.VeagleSpaceTech.DTO.response.UserResponseDTO(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getContact(),
                saved.getRole(),
                saved.getStatus()
        );
    }


    public List<UserResponseDTO> getAllUsers() {
        return repo.findAll()
                .stream()
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getContact(),
                        user.getRole(),
                        user.getStatus()
                ))
                .toList();
    }

    public UserResponseDTO updateUser(Long id, UserRequestDTO userResponseDTO) {

        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Super Admin Cant Updated
        if(user.getRole().equalsIgnoreCase("SADMIN"))
            throw new RuntimeException("Super Admin Cant Update .!!");

        // update fields
        user.setUsername(userResponseDTO.username());
        user.setEmail(userResponseDTO.email());
        user.setContact(userResponseDTO.contact());
        user.setRole(userResponseDTO.role());

        User updatedUser = repo.save(user);

        return new UserResponseDTO(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getContact(),
                updatedUser.getRole(),
                updatedUser.getStatus()
        );
    }


    public @Nullable String deleteUser(Long id) {

        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(user.getRole().equalsIgnoreCase("SADMIN"))
            throw new RuntimeException("Super Admin Cant Delete ..!!");

        repo.deleteById(id);
        return "Deleted...";
    }

    public UserResponseDTO addUserByAdmin(UserRequestDTO request) {

        // ✅ Convert DTO → Entity
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setContact(request.contact());
        user.setPassword(passwordEncoder.encode(request.password())); // 🔒 encode password
        user.setRole(request.role());
        //  default status is Active
        user.setStatus(UserStatus.ACTIVE);


        if (repo.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException("Email already exists");
        }
        else if (repo.existsByContact(request.contact())) {
            throw new UserAlreadyExistsException("Phone No. already exists");
        } else if (user.getRole().equalsIgnoreCase("SADMIN")) {
            throw new RuntimeException("Super Admin Cant Create By Admins");
        }


        //  Save entity
        User saved = repo.save(user);

        // ✅ Convert Entity → ResponseDTO
        return new UserResponseDTO(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getContact(),
                saved.getRole(),
                saved.getStatus()
        );
    }


    // Update Status
    public UserResponseDTO toggleUserStatus(Long id) {

        User targetUser = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 Get current logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();

        User currentUser = repo.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("Logged in user not found"));

        // 🚫 ADMIN cannot block SADMIN
        if (targetUser.getRole().equalsIgnoreCase("SADMIN") &&
                !currentUser.getRole().equalsIgnoreCase("SADMIN")) {

            throw new RuntimeException("You cannot block Super Admin");
        }

        // 🔄 TOGGLE LOGIC
        if (targetUser.getStatus() == UserStatus.ACTIVE) {
            targetUser.setStatus(UserStatus.BLOCKED);
        } else {
            targetUser.setStatus(UserStatus.ACTIVE);
        }

        User updated = repo.save(targetUser);

        return new UserResponseDTO(
                updated.getId(),
                updated.getUsername(),
                updated.getEmail(),
                updated.getContact(),
                updated.getRole(),
                updated.getStatus()
        );
    }
    // Get Admin By Id
    public @Nullable UserResponseDTO getAdminById(Long id) {

        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getContact(),
                user.getRole(),
                user.getStatus()
                );
    }

    // Update SAdmin Data
    public @Nullable UserResponseDTO updateAdmin(Long id, UserRequestDTO userRequestDTO) {

        User u = new User();
        u.setId(id);
        u.setUsername(userRequestDTO.username());
        u.setRole(userRequestDTO.role());
        u.setStatus(userRequestDTO.status());
        u.setEmail(userRequestDTO.email());
        u.setPassword(passwordEncoder.encode(userRequestDTO.password()));

        User user = repo.save(u);


        return new UserResponseDTO(user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getContact(),
                user.getRole(),
                user.getStatus()
                );
    }

    // ✅ GET PROFILE
    public UserResponseDTO getProfile() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getContact(),
                user.getRole(),
                user.getStatus()
        );
    }

    //  PROFILE
    public UserResponseDTO updateProfile(UpdateProfileDTO dto) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.username() != null) {
            user.setUsername(dto.username());
        }

        if (dto.contact() != null) {

            if (repo.existsByContact(dto.contact())
                    && !user.getContact().equals(dto.contact())) {
                throw new RuntimeException("Contact already exists");
            }

            user.setContact(dto.contact());
        }

        repo.save(user);

        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getContact(),
                user.getRole(),
                user.getStatus()
        );

    }



    // Send Otp To Email
    private final Map<String, OtpData> otpStore = new HashMap<>();

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

        emailService.sendEmail(email, "OTP Verification - VeagleSpace", message);
    }

    //verify Otp
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

        // ✅ Replace object (because record is immutable)
        OtpData updatedData = new OtpData(
                data.otp(),
                data.expiryTime(),
                true
        );

        otpStore.put(email, updatedData);
    }
    // Change PAssword
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

        // ✅ remove OTP after use
        otpStore.remove(email);
    }



}

