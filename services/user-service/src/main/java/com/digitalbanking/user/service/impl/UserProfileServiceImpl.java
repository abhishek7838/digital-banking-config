package com.digitalbanking.user.service.impl;

import com.digitalbanking.user.dto.RegisterUserProfileRequest;
import com.digitalbanking.user.dto.UserProfileResponse;
import com.digitalbanking.user.model.UserProfile;
import com.digitalbanking.user.repository.UserProfileRepository;
import com.digitalbanking.user.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public UserProfileResponse createProfile(RegisterUserProfileRequest request) {

        if (userProfileRepository.existsByEmail(request.getEmail())) {
            // we keep idempotent behaviour; you can throw if you like
            UserProfile existing = userProfileRepository.findByEmail(request.getEmail())
                    .orElseThrow();
            return toResponse(existing);
        }

        UserProfile profile = UserProfile.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        UserProfile saved = userProfileRepository.save(profile);
        return toResponse(saved);
    }

    @Override
    public UserProfileResponse getProfileByEmail(String email) {
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found for email: " + email));
        return toResponse(profile);
    }

    private UserProfileResponse toResponse(UserProfile profile) {
        return UserProfileResponse.builder()
                .id(profile.getId())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .build();
    }
}
