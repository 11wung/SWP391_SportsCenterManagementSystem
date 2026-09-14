package com.sportscenter.modules.auth.service;

import com.sportscenter.exception.BadRequestException;
import com.sportscenter.exception.ResourceNotFoundException;
import com.sportscenter.modules.auth.dto.AuthResponse;
import com.sportscenter.modules.auth.dto.LoginRequest;
import com.sportscenter.modules.auth.dto.RegisterRequest;
import com.sportscenter.modules.auth.dto.UserResponse;
import com.sportscenter.modules.auth.entity.Role;
import com.sportscenter.modules.auth.entity.User;
import com.sportscenter.modules.auth.repository.UserRepository;
import com.sportscenter.security.JwtTokenProvider;
import com.sportscenter.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email này đã được đăng ký trong hệ thống");
        }

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            if (userRepository.existsByPhone(request.getPhone())) {
                throw new BadRequestException("Số điện thoại này đã được sử dụng");
            }
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .gender(request.getGender())
                .dob(request.getDob())
                .role(Role.MEMBER)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Registered new member user: id={}, email={}", savedUser.getId(), savedUser.getEmail());

        UserPrincipal principal = UserPrincipal.create(savedUser);
        String token = tokenProvider.generateToken(principal);

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(UserResponse.fromEntity(savedUser))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(principal);

        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", principal.getEmail()));

        log.info("User logged in successfully: email={}, role={}", user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(UserResponse.fromEntity(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UserPrincipal principal) {
        if (principal == null) {
            throw new BadRequestException("Người dùng chưa được xác thực");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        return UserResponse.fromEntity(user);
    }
}
