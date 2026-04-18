package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepo extends JpaRepository<User,Long> {
    User findByUsername(String username);

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    long countByRole(String role);

    boolean existsByContact(@NotBlank(message = "Contact is required") @Pattern(regexp = "\\d{10}", message = "Contact must be 10 digits") String contact);

    Optional<User> findByVerificationToken(String token);

}
