package com.digitalbanking.auth.service.impl;

import com.digitalbanking.auth.client.UserClient;
import com.digitalbanking.auth.dto.AuthResponse;
import com.digitalbanking.auth.dto.LoginRequest;
import com.digitalbanking.auth.dto.RegisterRequest;
import com.digitalbanking.auth.model.User;
import com.digitalbanking.auth.repository.UserRepository;
import com.digitalbanking.auth.security.JwtService;
import com.digitalbanking.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserClient userClient;   // Feign client

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("CUSTOMER")
                .enabled(true)
                .build();

        userRepository.save(user);

        // Call user-service to create profile (best-effort)
        try {
            userClient.createUserProfile(request);
        } catch (Exception ex) {
            // log and continue; you can decide whether to rollback instead
            System.err.println("Failed to create user profile in user-service: " + ex.getMessage());
        }

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        var authToken = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        );
        authenticationManager.authenticate(authToken);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .build();
    }
}
