package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.response.UserResponseDTO;
import com.example.VeagleSpaceTech.DTO.request.AdminCreateRequest;
import com.example.VeagleSpaceTech.DTO.request.LoginRequest;
import com.example.VeagleSpaceTech.DTO.request.RegisterRequest;
import com.example.VeagleSpaceTech.DTO.request.UserRequestDTO;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

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

        return new com.example.VeagleSpaceTech.DTO.response.UserResponseDTO(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getContact(),
                saved.getRole(),
                saved.getStatus()
        );
    }

 // User Admin Login
    public AuthResponse login(LoginRequest request) {

        User user = repo.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Email not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(
                user.getId(),
                token,
                user.getRole(),
                user.getEmail(),
                user.getUsername(),
                user.getContact()
        );
    }

    // Admin Registration

    @Value("${admin.secret}")
    private String ADMIN_SECRET;

    public UserResponseDTO createAdmin(AdminCreateRequest request, String adminKey) {

//        System.out.println("\n from server  "+ADMIN_SECRET+"\t"+" From Frontend    "+adminKey+"\n");
        // Validate secret
        if (!ADMIN_SECRET.equals(adminKey)) {
            throw new RuntimeException("Unauthorized admin creation");
        }

        //  Limit admins
        long count = repo.countByRole("ADMIN");
        if (count >= 2) {
            throw new RuntimeException("Only 2 admins allowed");
        }

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

    public UserResponseDTO toggleUserStatus(Long id) {

        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 TOGGLE LOGIC
        if (user.getStatus() == UserStatus.ACTIVE) {
            user.setStatus(UserStatus.BLOCKED);
        } else {
            user.setStatus(UserStatus.ACTIVE);
        }

        User updated = repo.save(user);

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



}

