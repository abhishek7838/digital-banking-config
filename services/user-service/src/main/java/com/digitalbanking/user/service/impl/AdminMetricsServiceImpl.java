package com.digitalbanking.user.service.impl;

import com.digitalbanking.user.repository.UserProfileRepository;
import com.digitalbanking.user.service.AdminMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminMetricsServiceImpl implements AdminMetricsService {

    private final UserProfileRepository userProfileRepository;

    @Override
    public long getTotalUsers() {
        // Uses JPA built-in count() => SELECT COUNT(*) FROM user_profiles
        return userProfileRepository.count();
    }
}
