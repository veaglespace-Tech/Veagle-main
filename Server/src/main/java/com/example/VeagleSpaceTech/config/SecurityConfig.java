package com.example.VeagleSpaceTech.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.cors(cors -> {});
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(req ->
                        req.requestMatchers(HttpMethod.POST, "/api/leads").hasRole("USER")
                                .requestMatchers(HttpMethod.POST, "/careers/apply").hasRole("USER")
                                .requestMatchers(
                                        "/login", "/register", "/auth/**",
                                        "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html",
                                        "/uploads/**"
                                ).permitAll()
                                .requestMatchers("/api/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                                .requestMatchers("/admin/**").hasAnyRole("ADMIN", "SADMIN")
                                .requestMatchers("/sadmin/**").hasRole("SADMIN")
                                .requestMatchers("/user/**").hasRole("USER")
                                .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
