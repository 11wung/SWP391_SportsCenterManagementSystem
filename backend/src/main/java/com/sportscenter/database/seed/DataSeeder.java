package com.sportscenter.database.seed;

import com.sportscenter.modules.auth.entity.Role;
import com.sportscenter.modules.auth.entity.User;
import com.sportscenter.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded with users. Skipping DataSeeder.");
            return;
        }

        log.info("Seeding initial users into database via JPA ORM...");

        User admin = User.builder()
                .email("admin@sportcenter.com")
                .passwordHash(passwordEncoder.encode("Admin@123456"))
                .fullName("Quản Trị Viên Hệ Thống")
                .phone("0901234567")
                .gender("MALE")
                .dob(LocalDate.of(1990, 1, 1))
                .role(Role.ADMIN)
                .isActive(true)
                .build();

        User coach1 = User.builder()
                .email("coach1@sportcenter.com")
                .passwordHash(passwordEncoder.encode("Coach@123456"))
                .fullName("Nguyễn Văn Thể (HLV Thể Hình)")
                .phone("0912345678")
                .gender("MALE")
                .dob(LocalDate.of(1993, 5, 12))
                .role(Role.COACH)
                .isActive(true)
                .build();

        User coach2 = User.builder()
                .email("coach2@sportcenter.com")
                .passwordHash(passwordEncoder.encode("Coach@123456"))
                .fullName("Trần Thị Mai (HLV Yoga)")
                .phone("0923456789")
                .gender("FEMALE")
                .dob(LocalDate.of(1995, 8, 20))
                .role(Role.COACH)
                .isActive(true)
                .build();

        User receptionist1 = User.builder()
                .email("receptionist@sportcenter.com")
                .passwordHash(passwordEncoder.encode("Recep@123456"))
                .fullName("Lê Thu Hằng (Lễ Tân Ca Sáng)")
                .phone("0934567890")
                .gender("FEMALE")
                .dob(LocalDate.of(1998, 3, 15))
                .role(Role.RECEPTIONIST)
                .isActive(true)
                .build();

        User receptionist2 = User.builder()
                .email("receptionist2@sportcenter.com")
                .passwordHash(passwordEncoder.encode("Recep@123456"))
                .fullName("Phạm Minh Anh (Lễ Tân Ca Chiều)")
                .phone("0945678901")
                .gender("FEMALE")
                .dob(LocalDate.of(1999, 11, 25))
                .role(Role.RECEPTIONIST)
                .isActive(true)
                .build();

        User member1 = User.builder()
                .email("member1@sportcenter.com")
                .passwordHash(passwordEncoder.encode("Member@123456"))
                .fullName("Đặng Quốc Cường (Hội viên VIP)")
                .phone("0956789012")
                .gender("MALE")
                .dob(LocalDate.of(1992, 4, 10))
                .role(Role.MEMBER)
                .isActive(true)
                .build();

        User member2 = User.builder()
                .email("member2@sportcenter.com")
                .passwordHash(passwordEncoder.encode("Member@123456"))
                .fullName("Hoàng Ngọc Linh (Hội viên Gold)")
                .phone("0967890123")
                .gender("FEMALE")
                .dob(LocalDate.of(1996, 7, 18))
                .role(Role.MEMBER)
                .isActive(true)
                .build();

        User member3 = User.builder()
                .email("member3@sportcenter.com")
                .passwordHash(passwordEncoder.encode("Member@123456"))
                .fullName("Vũ Hoàng Nam (Hội viên Thường)")
                .phone("0978901234")
                .gender("MALE")
                .dob(LocalDate.of(2001, 12, 5))
                .role(Role.MEMBER)
                .isActive(true)
                .build();

        userRepository.saveAll(List.of(admin, coach1, coach2, receptionist1, receptionist2, member1, member2, member3));
        log.info("Successfully seeded 8 initial sample accounts into database!");
    }
}
