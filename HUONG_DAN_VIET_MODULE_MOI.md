# HƯỚNG DẪN PHÁT TRIỂN MODULE MỚI (TỪ A ĐẾN Z)
> **Dành cho sinh viên & lập trình viên mới gia nhập dự án Sports Center Management System**  
> *Kiến trúc chuẩn: Spring Boot 3 (Pure JPA ORM, No Raw SQL) + ReactJS (Vite, Tailwind CSS, JavaScript .jsx)*

---

## MỤC LỤC
1. [Quy Tắc Vàng Trong Dự Án](#1-quy-tắc-vàng-trong-dự-án)
2. [Lộ Trình 10 Bước Phát Triển Module Mới](#2-lộ-trình-10-bước-phát-triển-module-mới)
   - [Bước 1: Tra cứu Schema Database](#bước-1-tra-cứu-schema-database)
   - [Bước 2: Tạo JPA Entity](#bước-2-tạo-jpa-entity)
   - [Bước 3: Tạo các DTO (Data Transfer Object)](#bước-3-tạo-các-dto-data-transfer-object)
   - [Bước 4: Tạo Repository (Pure JPA ORM)](#bước-4-tạo-repository-pure-jpa-orm)
   - [Bước 5: Tạo Specification (Tìm kiếm & Lọc Động)](#bước-5-tạo-specification-tìm-kiếm--lọc-động)
   - [Bước 6: Tạo Service Interface & ServiceImpl](#bước-6-tạo-service-interface--serviceimpl)
   - [Bước 7: Tạo REST Controller & Swagger Docs](#bước-7-tạo-rest-controller--swagger-docs)
   - [Bước 8: Viết API Client phía Frontend (Axios)](#bước-8-viết-api-client-phía-frontend-axios)
   - [Bước 9: Xây dựng Giao diện Trang & Component (React)](#bước-9-xây-dựng-giao-diện-trang--component-react)
   - [Bước 10: Đăng ký Route & Phân quyền bảo vệ](#bước-10-đăng-ký-route--phân-quyền-bảo-vệ)
3. [Top 7 Lỗi Thường Gặp Của Sinh Viên & Cách Khắc Phục](#3-top-7-lỗi-thường-gặp-của-sinh-viên--cách-khắc-phục)
4. [Checklist Tự Kiểm Tra Trước Khi Tạo Pull Request](#4-checklist-tự-kiểm-tra-trước-khi-tạo-pull-request)

---

## 1. QUY TẮC VÀNG TRONG DỰ ÁN

| # | Quy tắc | Chi tiết |
|---|---|---|
| 1 | **Tách Module rõ ràng** | Mỗi tính năng nghiệp vụ nằm trong thư mục con: `backend/src/main/java/com/sportscenter/modules/<ten_module>/` |
| 2 | **Pure JPA ORM** | **TUYỆT ĐỐI KHÔNG VIẾT QUERY SQL/HQL THÔ** (`@Query("SELECT ...")`). Hãy tận dụng Spring Data Derived Methods (`findBy...`, `existsBy...`) và Criteria API `Specification`. |
| 3 | **Không trả Entity ra ngoài Controller** | Luôn map Entity sang DTO (`ResponseDTO.fromEntity(entity)`) để bảo mật và tránh lỗi vòng lặp JSON (Infinite Recursion). |
| 4 | **Luôn validate đầu vào** | Mọi dữ liệu từ client gửi lên Controller phải có `@Valid @RequestBody` và các annotation `@NotBlank`, `@Min`, `@Pattern`. |
| 5 | **Frontend thuần JavaScript** | Sử dụng file `.js`, `.jsx`, tuyệt đối **KHÔNG dùng TypeScript** (`.ts`, `.tsx`). |

---

## 2. LỘ TRÌNH 10 BƯỚC PHÁT TRIỂN MODULE MỚI
*Chúng ta sẽ lấy ví dụ thực tế: Thêm module **Quản lý Gói Tập (Membership Package)**.*

```
backend/src/main/java/com/sportscenter/modules/packages/
├── entity/
│   └── MembershipPackage.java       (Bước 2)
├── dto/
│   ├── CreatePackageRequest.java    (Bước 3)
│   └── PackageResponse.java         (Bước 3)
├── repository/
│   ├── PackageRepository.java       (Bước 4)
│   └── PackageSpecification.java    (Bước 5)
├── service/
│   ├── PackageService.java          (Bước 6)
│   └── PackageServiceImpl.java      (Bước 6)
└── controller/
    └── PackageController.java       (Bước 7)

frontend/src/
├── api/packageApi.js                (Bước 8)
├── pages/PackagesPage.jsx           (Bước 9)
└── App.jsx                          (Bước 10)
```

---

### Bước 1: Tra cứu Schema Database
Mở file `backend/src/main/resources/db/migration/V1__init_sports_center_schema.sql` để xem cấu trúc bảng tương ứng:
```sql
CREATE TABLE IF NOT EXISTS membership_packages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    duration_months INT NOT NULL CHECK (duration_months > 0),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    max_class_per_week INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### Bước 2: Tạo JPA Entity
Tạo file `backend/src/main/java/com/sportscenter/modules/packages/entity/MembershipPackage.java`:

```java
package com.sportscenter.modules.packages.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "membership_packages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_months", nullable = false)
    private Integer durationMonths;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "max_class_per_week")
    private Integer maxClassPerWeek;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        if (this.isActive == null) this.isActive = true;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
```

---

### Bước 3: Tạo các DTO (Data Transfer Object)

#### 3.1. DTO Nhận Dữ Liệu Tạo Mới: `CreatePackageRequest.java`
```java
package com.sportscenter.modules.packages.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePackageRequest {

    @NotBlank(message = "Tên gói tập không được để trống")
    @Size(max = 100, message = "Tên gói tập tối đa 100 ký tự")
    private String name;

    @NotBlank(message = "Mã gói tập không được để trống")
    @Size(max = 50, message = "Mã gói tập tối đa 50 ký tự")
    private String code;

    private String description;

    @NotNull(message = "Thời hạn gói tập không được để trống")
    @Min(value = 1, message = "Thời hạn tối thiểu là 1 tháng")
    private Integer durationMonths;

    @NotNull(message = "Giá tiền không được để trống")
    @DecimalMin(value = "0.0", inclusive = true, message = "Giá tiền không được âm")
    private BigDecimal price;

    @Min(value = 0, message = "Số buổi lớp tối đa không được âm")
    private Integer maxClassPerWeek;
}
```

#### 3.2. DTO Trả Kết Quả Ra Ngoài: `PackageResponse.java`
```java
package com.sportscenter.modules.packages.dto;

import com.sportscenter.modules.packages.entity.MembershipPackage;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackageResponse {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Integer durationMonths;
    private BigDecimal price;
    private Integer maxClassPerWeek;
    private Boolean isActive;
    private Instant createdAt;

    public static PackageResponse fromEntity(MembershipPackage pkg) {
        if (pkg == null) return null;
        return PackageResponse.builder()
                .id(pkg.getId())
                .name(pkg.getName())
                .code(pkg.getCode())
                .description(pkg.getDescription())
                .durationMonths(pkg.getDurationMonths())
                .price(pkg.getPrice())
                .maxClassPerWeek(pkg.getMaxClassPerWeek())
                .isActive(pkg.getIsActive())
                .createdAt(pkg.getCreatedAt())
                .build();
    }
}
```

---

### Bước 4: Tạo Repository (Pure JPA ORM)
Kế thừa `JpaRepository` và `JpaSpecificationExecutor`. **Không viết `@Query`!**

```java
package com.sportscenter.modules.packages.repository;

import com.sportscenter.modules.packages.entity.MembershipPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PackageRepository extends JpaRepository<MembershipPackage, Long>, JpaSpecificationExecutor<MembershipPackage> {
    
    // Tự động sinh truy vấn ORM dựa trên tên hàm (Derived Query)
    boolean existsByCode(String code);
    Optional<MembershipPackage> findByCode(String code);
}
```

---

### Bước 5: Tạo Specification (Tìm kiếm & Lọc Động)
Dùng JPA Criteria API thuần túy để ghép các điều kiện lọc linh hoạt:

```java
package com.sportscenter.modules.packages.repository;

import com.sportscenter.modules.packages.entity.MembershipPackage;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;
import java.util.ArrayList;
import java.util.List;

public class PackageSpecification {

    public static Specification<MembershipPackage> filter(String keyword, Boolean isActive) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(keyword)) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), pattern);
                Predicate codeMatch = cb.like(cb.lower(root.get("code")), pattern);
                predicates.add(cb.or(nameMatch, codeMatch));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
```

---

### Bước 6: Tạo Service Interface & ServiceImpl

#### 6.1. Interface: `PackageService.java`
```java
package com.sportscenter.modules.packages.service;

import com.sportscenter.modules.auth.dto.PagedResponse;
import com.sportscenter.modules.packages.dto.CreatePackageRequest;
import com.sportscenter.modules.packages.dto.PackageResponse;
import org.springframework.data.domain.Pageable;

public interface PackageService {
    PagedResponse<PackageResponse> getPackages(String keyword, Boolean isActive, Pageable pageable);
    PackageResponse createPackage(CreatePackageRequest request);
    PackageResponse getPackageById(Long id);
    PackageResponse toggleStatus(Long id);
}
```

#### 6.2. Implementation: `PackageServiceImpl.java`
```java
package com.sportscenter.modules.packages.service;

import com.sportscenter.exception.BadRequestException;
import com.sportscenter.exception.ResourceNotFoundException;
import com.sportscenter.modules.auth.dto.PagedResponse;
import com.sportscenter.modules.packages.dto.CreatePackageRequest;
import com.sportscenter.modules.packages.dto.PackageResponse;
import com.sportscenter.modules.packages.entity.MembershipPackage;
import com.sportscenter.modules.packages.repository.PackageRepository;
import com.sportscenter.modules.packages.repository.PackageSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PackageServiceImpl implements PackageService {

    private final PackageRepository packageRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PackageResponse> getPackages(String keyword, Boolean isActive, Pageable pageable) {
        Page<MembershipPackage> page = packageRepository.findAll(
                PackageSpecification.filter(keyword, isActive),
                pageable
        );
        return PagedResponse.from(page.map(PackageResponse::fromEntity));
    }

    @Override
    @Transactional
    public PackageResponse createPackage(CreatePackageRequest request) {
        if (packageRepository.existsByCode(request.getCode().toUpperCase().trim())) {
            throw new BadRequestException("Mã gói tập '" + request.getCode() + "' đã tồn tại!");
        }

        MembershipPackage pkg = MembershipPackage.builder()
                .name(request.getName().trim())
                .code(request.getCode().toUpperCase().trim())
                .description(request.getDescription())
                .durationMonths(request.getDurationMonths())
                .price(request.getPrice())
                .maxClassPerWeek(request.getMaxClassPerWeek() != null ? request.getMaxClassPerWeek() : 0)
                .isActive(true)
                .build();

        return PackageResponse.fromEntity(packageRepository.save(pkg));
    }

    @Override
    @Transactional(readOnly = true)
    public PackageResponse getPackageById(Long id) {
        MembershipPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gói tập", "id", id));
        return PackageResponse.fromEntity(pkg);
    }

    @Override
    @Transactional
    public PackageResponse toggleStatus(Long id) {
        MembershipPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gói tập", "id", id));
        pkg.setIsActive(!pkg.getIsActive());
        return PackageResponse.fromEntity(packageRepository.save(pkg));
    }
}
```

---

### Bước 7: Tạo REST Controller & Swagger Docs
Đặt annotations Swagger `@Tag`, `@Operation`, và phân quyền `@PreAuthorize`:

```java
package com.sportscenter.modules.packages.controller;

import com.sportscenter.modules.auth.dto.ApiResponse;
import com.sportscenter.modules.auth.dto.PagedResponse;
import com.sportscenter.modules.packages.dto.CreatePackageRequest;
import com.sportscenter.modules.packages.dto.PackageResponse;
import com.sportscenter.modules.packages.service.PackageService;
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
@RequestMapping("/api/v1/packages")
@RequiredArgsConstructor
@Tag(name = "Membership Packages", description = "API quản lý các gói tập hội viên")
public class PackageController {

    private final PackageService packageService;

    @GetMapping
    @Operation(summary = "Lấy danh sách gói tập có phân trang và tìm kiếm")
    public ResponseEntity<ApiResponse<PagedResponse<PackageResponse>>> getPackages(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PagedResponse<PackageResponse> data = packageService.getPackages(keyword, isActive, pageable);
        return ResponseEntity.ok(ApiResponse.ok(data, "Lấy danh sách gói tập thành công"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tạo mới gói tập (Chỉ ADMIN)")
    public ResponseEntity<ApiResponse<PackageResponse>> createPackage(
            @Valid @RequestBody CreatePackageRequest request
    ) {
        PackageResponse data = packageService.createPackage(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(data, "Tạo gói tập thành công"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Bật/tắt trạng thái hoạt động gói tập")
    public ResponseEntity<ApiResponse<PackageResponse>> toggleStatus(@PathVariable Long id) {
        PackageResponse data = packageService.toggleStatus(id);
        return ResponseEntity.ok(ApiResponse.ok(data, "Cập nhật trạng thái thành công"));
    }
}
```

---

### Bước 8: Viết API Client phía Frontend (Axios)
Tạo file `frontend/src/api/packageApi.js`:

```javascript
import axiosClient from './axiosClient';

export const packageApi = {
  getPackages: (params = {}) => {
    return axiosClient.get('/api/v1/packages', { params });
  },

  createPackage: (data) => {
    return axiosClient.post('/api/v1/packages', data);
  },

  toggleStatus: (id) => {
    return axiosClient.patch(`/api/v1/packages/${id}/status`);
  },
};
```

---

### Bước 9: Xây dựng Giao diện Trang & Component (React)
Tạo trang `frontend/src/pages/PackagesPage.jsx` tận dụng các component dùng chung có sẵn:
- Sử dụng `<Table />` từ `../components/Table`
- Sử dụng `<Modal />` từ `../components/Modal`
- Sử dụng `<Input />` từ `../components/Input`
- Sử dụng `<StatusBadge />` từ `../components/Badge`

---

### Bước 10: Đăng ký Route & Phân quyền bảo vệ
Mở file `frontend/src/App.jsx` và thêm route mới:

```jsx
import { PackagesPage } from './pages/PackagesPage';

// Trong AppLayout -> <Routes>:
<Route
  path="/admin/packages"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <PackagesPage />
    </ProtectedRoute>
  }
/>
```

---

## 3. TOP 7 LỖI THƯỜNG GẶP CỦA SINH VIÊN & CÁCH KHẮC PHỤC

### Lỗi 1: Quên `@Valid` ở Controller
- **Triệu chứng**: Gửi dữ liệu trống hoặc sai định dạng nhưng backend không báo lỗi mà lưu thẳng vào DB gây lỗi 500.
- **Khắc phục**: Luôn đặt `@Valid` trước `@RequestBody`:
  ```java
  public ResponseEntity<?> create(@Valid @RequestBody CreateRequest request)
  ```

### Lỗi 2: IDE không nhận diện Lombok (`cannot find symbol method getId()`)
- **Khắc phục**:
  - Trong IntelliJ IDEA: Vào **Settings** -> **Build, Execution, Deployment** -> **Compiler** -> **Annotation Processors** -> Tích chọn **Enable annotation processing**.
  - Trong VS Code: Cài extension **Lombok Annotations Support for VS Code**.

### Lỗi 3: Quên `@Transactional` ở Service
- **Triệu chứng**: Dữ liệu không lưu xuống database, hoặc khi ném exception dữ liệu trước đó không được rollback.
- **Khắc phục**: Luôn thêm `@Transactional` cho các hàm ghi (create/update/delete) và `@Transactional(readOnly = true)` cho các hàm đọc (get/search).

### Lỗi 4: Viết câu `@Query` SQL thô
- **Quy định**: Dự án nghiêm cấm dùng `@Query("SELECT ...")`.
- **Khắc phục**: Dùng tên hàm chuẩn JPA (`findBy...`, `existsBy...`) hoặc `Specification` với JPA Criteria API.

### Lỗi 5: Lỗi phân quyền 403 khi dùng `@PreAuthorize`
- **Nguyên nhân**: Spring Security so khớp role dựa trên prefix `ROLE_`. Nếu trong JWT hoặc UserPrincipal chỉ cấp `ADMIN` thay vì `ROLE_ADMIN`, `hasRole('ADMIN')` sẽ luôn trả về 403 Forbidden.
- **Khắc phục**: Trong `UserPrincipal`, quyền hạn đã được cấu hình chuẩn:
  `new SimpleGrantedAuthority("ROLE_" + user.getRole().name())`. Không sửa đổi format này.

### Lỗi 6: Frontend bị lỗi CORS
- **Nguyên nhân**: Frontend chạy port lạ (ví dụ port 3001, 8081) chưa được khai báo trong `CorsConfig.java`.
- **Khắc phục**: Frontend phải chạy ở port mặc định `http://localhost:5173` hoặc thêm port mới vào `backend/src/main/java/com/sportscenter/config/CorsConfig.java`.

### Lỗi 7: Lỗi Circular Reference khi serialize JSON
- **Nguyên nhân**: Trả trực tiếp JPA Entity có quan hệ hai chiều (`@ManyToOne`, `@OneToMany`) ra Controller.
- **Khắc phục**: Luôn chuyển đổi sang `ResponseDTO` trước khi trả về client.

---

## 4. CHECKLIST TỰ KIỂM TRA TRƯỚC KHI TẠO PULL REQUEST

- [ ] Entity có đầy đủ `@Table`, `@Id`, `createdAt`, `updatedAt` chưa?
- [ ] DTO có gắn đầy đủ các Bean Validation (`@NotBlank`, `@Min`, ...) chưa?
- [ ] Repository kế thừa `JpaRepository` & `JpaSpecificationExecutor`, **không chứa `@Query`**?
- [ ] Service có `@Transactional` và ném đúng `BadRequestException`/`ResourceNotFoundException`?
- [ ] Controller có `@PreAuthorize` đúng vai trò quy định và có Swagger `@Operation`?
- [ ] Đã chạy test compile backend: `.\mvnw.cmd test-compile` báo `BUILD SUCCESS`?
- [ ] Frontend viết file `.jsx`, không dùng cú pháp TypeScript?
- [ ] Đã build frontend: `npm run build` thành công không báo lỗi?
- [ ] Đã kiểm thử API qua Swagger UI (`/swagger-ui/index.html`) với nút Authorize Bearer token?
