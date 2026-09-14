package com.sportscenter.modules.auth.controller;

import com.sportscenter.modules.auth.dto.ApiResponse;
import com.sportscenter.modules.auth.dto.AuthResponse;
import com.sportscenter.modules.auth.dto.LoginRequest;
import com.sportscenter.modules.auth.dto.RegisterRequest;
import com.sportscenter.modules.auth.dto.UserResponse;
import com.sportscenter.modules.auth.service.AuthService;
import com.sportscenter.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints cho Đăng ký, Đăng nhập và Lấy thông tin cá nhân")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản hội viên (MEMBER)")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Đăng ký tài khoản hội viên thành công"));
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống và nhận Bearer JWT")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Đăng nhập thành công"));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin tài khoản hiện tại từ JWT token")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UserResponse response = authService.getCurrentUser(principal);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy thông tin tài khoản thành công"));
    }
}
