package com.sportscenter.modules.auth.controller;

import com.sportscenter.modules.auth.dto.ApiResponse;
import com.sportscenter.modules.auth.dto.CreateUserRequest;
import com.sportscenter.modules.auth.dto.PagedResponse;
import com.sportscenter.modules.auth.dto.UpdateUserStatusRequest;
import com.sportscenter.modules.auth.dto.UserResponse;
import com.sportscenter.modules.auth.entity.Role;
import com.sportscenter.modules.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Users", description = "Quản lý danh sách người dùng cho Quản trị viên (ADMIN)")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Lấy danh sách người dùng với phân trang, tìm kiếm và bộ lọc (ADMIN)")
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean isActive,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PagedResponse<UserResponse> response = userService.getUsers(keyword, role, isActive, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy danh sách người dùng thành công"));
    }

    @PostMapping
    @Operation(summary = "Tạo mới tài khoản nhân viên (COACH, RECEPTIONIST, ADMIN)")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Tạo tài khoản nhân viên thành công"));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Kích hoạt hoặc vô hiệu hóa tài khoản người dùng")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        UserResponse response = userService.updateUserStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Cập nhật trạng thái người dùng thành công"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết người dùng theo ID")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Lấy thông tin người dùng thành công"));
    }
}
