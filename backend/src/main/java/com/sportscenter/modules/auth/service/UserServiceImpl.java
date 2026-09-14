package com.sportscenter.modules.auth.service;

import com.sportscenter.exception.BadRequestException;
import com.sportscenter.exception.ResourceNotFoundException;
import com.sportscenter.modules.auth.dto.CreateUserRequest;
import com.sportscenter.modules.auth.dto.PagedResponse;
import com.sportscenter.modules.auth.dto.UpdateUserStatusRequest;
import com.sportscenter.modules.auth.dto.UserResponse;
import com.sportscenter.modules.auth.entity.Role;
import com.sportscenter.modules.auth.entity.User;
import com.sportscenter.modules.auth.repository.UserRepository;
import com.sportscenter.modules.auth.repository.UserSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getUsers(String keyword, Role role, Boolean isActive, Pageable pageable) {
        Page<User> userPage = userRepository.findAll(
                UserSpecification.filter(keyword, role, isActive),
                pageable
        );

        Page<UserResponse> responsePage = userPage.map(UserResponse::fromEntity);
        return PagedResponse.from(responsePage);
    }

    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email này đã được sử dụng");
        }

        if (StringUtils.hasText(request.getPhone()) && userRepository.existsByPhone(request.getPhone().trim())) {
            throw new BadRequestException("Số điện thoại này đã được sử dụng");
        }

        String rawPassword = StringUtils.hasText(request.getPassword())
                ? request.getPassword()
                : "Default@123456";

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .fullName(request.getFullName().trim())
                .role(request.getRole())
                .gender(request.getGender())
                .dob(request.getDob())
                .passwordHash(passwordEncoder.encode(rawPassword))
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Admin created new staff user: id={}, email={}, role={}", savedUser.getId(), savedUser.getEmail(), savedUser.getRole());

        return UserResponse.fromEntity(savedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUserStatus(Long id, UpdateUserStatusRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        user.setIsActive(request.getIsActive());
        User updatedUser = userRepository.save(user);

        log.info("Updated status for user: id={}, isActive={}", updatedUser.getId(), updatedUser.getIsActive());
        return UserResponse.fromEntity(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return UserResponse.fromEntity(user);
    }
}
