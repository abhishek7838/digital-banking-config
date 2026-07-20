package com.digitalbanking.user.controller;

import com.digitalbanking.user.dto.RegisterUserProfileRequest;
import com.digitalbanking.user.dto.UserProfileResponse;
import com.digitalbanking.user.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")   
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    // Called by auth-service Feign client
    @PostMapping("/register")
    public ResponseEntity<Void> registerProfile(
            @Valid @RequestBody RegisterUserProfileRequest request) {

        userProfileService.createProfile(request);
        return ResponseEntity.ok().build();
    }

    // ✅ NEW: current logged-in user (for /api/users/me)
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
        // we set email as principal in JwtAuthenticationFilter
        String email = authentication.getName();
        return ResponseEntity.ok(userProfileService.getProfileByEmail(email));
    }

    // optional: still useful for internal/admin use
    @GetMapping("/by-email")
    public ResponseEntity<UserProfileResponse> getByEmail(
            @RequestParam("email") String email) {

        return ResponseEntity.ok(userProfileService.getProfileByEmail(email));
    }
}
