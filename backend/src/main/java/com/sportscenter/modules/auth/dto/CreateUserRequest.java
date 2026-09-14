package com.sportscenter.modules.auth.dto;

import com.sportscenter.modules.auth.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng email không hợp lệ")
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Số điện thoại không hợp lệ (chuẩn 10 chữ số VN)")
    private String phone;

    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    @NotNull(message = "Vai trò (role) không được để trống")
    private Role role;

    private String password;

    private String gender;

    private LocalDate dob;
}
