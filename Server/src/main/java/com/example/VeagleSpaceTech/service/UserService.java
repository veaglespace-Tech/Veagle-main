package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.UpdateProfileDTO;
import com.example.VeagleSpaceTech.DTO.request.UserRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.UserResponseDTO;
import com.example.VeagleSpaceTech.entity.User;
import com.example.VeagleSpaceTech.enums.UserStatus;
import com.example.VeagleSpaceTech.exception.UserAlreadyExistsException;
import com.example.VeagleSpaceTech.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo repo;
    private final PasswordEncoder passwordEncoder;

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
