package com.digitalbanking.auth.service;

import com.digitalbanking.auth.dto.AuthResponse;
import com.digitalbanking.auth.dto.LoginRequest;
import com.digitalbanking.auth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
