package com.sportscenter.modules.auth.service;

import com.sportscenter.modules.auth.dto.AuthResponse;
import com.sportscenter.modules.auth.dto.LoginRequest;
import com.sportscenter.modules.auth.dto.RegisterRequest;
import com.sportscenter.modules.auth.dto.UserResponse;
import com.sportscenter.security.UserPrincipal;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getCurrentUser(UserPrincipal principal);
}
