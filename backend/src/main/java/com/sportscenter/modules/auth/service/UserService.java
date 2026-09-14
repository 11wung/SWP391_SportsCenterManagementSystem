package com.sportscenter.modules.auth.service;

import com.sportscenter.modules.auth.dto.CreateUserRequest;
import com.sportscenter.modules.auth.dto.PagedResponse;
import com.sportscenter.modules.auth.dto.UpdateUserStatusRequest;
import com.sportscenter.modules.auth.dto.UserResponse;
import com.sportscenter.modules.auth.entity.Role;
import org.springframework.data.domain.Pageable;

public interface UserService {

    PagedResponse<UserResponse> getUsers(String keyword, Role role, Boolean isActive, Pageable pageable);

    UserResponse createUser(CreateUserRequest request);

    UserResponse updateUserStatus(Long id, UpdateUserStatusRequest request);

    UserResponse getUserById(Long id);
}
