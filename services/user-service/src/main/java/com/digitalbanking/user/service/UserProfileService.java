package com.digitalbanking.user.service;

import com.digitalbanking.user.dto.RegisterUserProfileRequest;
import com.digitalbanking.user.dto.UserProfileResponse;

public interface UserProfileService {

    UserProfileResponse createProfile(RegisterUserProfileRequest request);

    UserProfileResponse getProfileByEmail(String email);
}
