# Sports Center Management System (Monorepo)

Hệ thống Quản lý Trung tâm Thể thao Đa năng được thiết kế theo kiến trúc chuẩn Doanh nghiệp với Monorepo phân tách `backend/` và `frontend/`.

> 📘 **TÀI LIỆU HƯỚNG DẪN DÀNH CHO SINH VIÊN & THÀNH VIÊN MỚI:**
> - 📋 **[Đặc Tả Nghiệp Vụ Hệ Thống (Business Requirements)](NGHIEP_VU_HE_THONG.md)**: Chi tiết 8 phân hệ nghiệp vụ, đối tượng người dùng, ma trận phân quyền RBAC, sơ đồ vòng đời dữ liệu và quy tắc ràng buộc.
> - 🛠️ **[Hướng Dẫn Viết Code Module Mới (Từ A đến Z)](HUONG_DAN_VIET_MODULE_MOI.md)**: Quy trình 10 bước chuẩn mực (từ Entity, DTO, Repository, Specification, Service, Controller tới React UI), các lỗi hay gặp và checklist trước khi tạo PR.
> - 🚀 **[Hướng Dẫn Cài Đặt & Khởi Chạy Hệ Thống (Local & Docker)](HUONG_DAN_CAI_DAT_VA_CHAY.md)**: Hướng dẫn chạy 1 click bằng Docker nếu máy lỗi môi trường, hoặc chạy Local với H2 Database / PostgreSQL.

---

## 1. Cấu Trúc Dự Án (Monorepo)

```
/
├── docker-compose.yml              # Khởi tạo nhanh PostgreSQL 16 & pgAdmin 4
├── README.md
├── backend/                        # Java 21, Spring Boot 3.3.x, Spring Security 6, JPA ORM, JJWT 0.12.6
│   ├── mvnw & mvnw.cmd             # Maven Wrapper (chạy không cần cài Maven)
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── resources/
│       │   │   ├── application.yml # Cấu hình PostgreSQL (mặc định), JWT, CORS, Swagger
│       │   │   ├── application-dev.yml # Cấu hình H2 In-Memory (dành cho dev/test độc lập)
│       │   │   └── db/migration/
│       │   │       └── V1__init_sports_center_schema.sql # Toàn bộ DDL PostgreSQL 14 bảng quan hệ
│       │   └── java/com/sportscenter/
│       │       ├── SportsCenterApplication.java
│       │       ├── config/         # SecurityConfig, OpenApiConfig (Swagger UI), CorsConfig
│       │       ├── security/       # JwtTokenProvider, JwtAuthFilter, CustomUserDetailsService, UserPrincipal
│       │       ├── modules/auth/   # Entity User & Role, DTOs, Repository, Service, Controller
│       │       ├── exception/      # AppException, GlobalExceptionHandler (@RestControllerAdvice)
│       │       └── database/seed/  # DataSeeder (CommandLineRunner nạp 8 tài khoản mẫu chuẩn)
└── frontend/                       # React 18+ (Vite, Javascript thuần .jsx) + Tailwind CSS + Lucide Icons
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── api/                    # axiosClient.js (JWT Interceptor, 401 redirect), authApi.js, userApi.js
        ├── components/             # Modal.jsx, Table.jsx, Badge.jsx, Input.jsx, Navbar.jsx
        ├── context/                # AuthContext.jsx (quản lý login, user state, logout)
        ├── pages/                  # Login.jsx, Register.jsx, AdminUsersPage.jsx, Forbidden.jsx, HomePage.jsx
        └── routes/                 # ProtectedRoute.jsx (kiểm tra token & phân quyền allowedRoles)
```

---

## 2. Dữ Liệu Mẫu Mặc Định (Data Seeder)

Khi cơ sở dữ liệu rỗng, `DataSeeder` sẽ tự động khởi tạo 8 tài khoản mẫu đã mã hóa BCrypt:

| Vai Trò | Họ và Tên | Email | Mật Khẩu | SĐT |
|---|---|---|---|---|
| **ADMIN** | Quản Trị Viên Hệ Thống | `admin@sportcenter.com` | `Admin@123456` | `0901234567` |
| **COACH** | Nguyễn Văn Thể (HLV Thể Hình) | `coach1@sportcenter.com` | `Coach@123456` | `0912345678` |
| **COACH** | Trần Thị Mai (HLV Yoga) | `coach2@sportcenter.com` | `Coach@123456` | `0923456789` |
| **RECEPTIONIST** | Lê Thu Hằng (Lễ Tân Ca Sáng) | `receptionist@sportcenter.com` | `Recep@123456` | `0934567890` |
| **RECEPTIONIST** | Phạm Minh Anh (Lễ Tân Ca Chiều) | `receptionist2@sportcenter.com` | `Recep@123456` | `0945678901` |
| **MEMBER** | Đặng Quốc Cường (Hội viên VIP) | `member1@sportcenter.com` | `Member@123456` | `0956789012` |
| **MEMBER** | Hoàng Ngọc Linh (Hội viên Gold) | `member2@sportcenter.com` | `Member@123456` | `0967890123` |
| **MEMBER** | Vũ Hoàng Nam (Hội viên Thường) | `member3@sportcenter.com` | `Member@123456` | `0978901234` |

---

## 3. Hướng Dẫn Chạy Hệ Thống

### Bước 1: Khởi động Cơ sở dữ liệu (PostgreSQL)
Cách 1: Sử dụng Docker Compose (nhanh nhất):
```powershell
docker compose up -d
```
*Lưu ý: File DDL `V1__init_sports_center_schema.sql` sẽ tự động được chạy trong container PostgreSQL.*

Cách 2: Nếu không dùng Docker, bạn có thể chạy backend với profile H2 In-Memory:
```powershell
cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

### Bước 2: Khởi động Backend (Spring Boot 3)
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
- API chạy tại: `http://localhost:8080`
- Swagger UI (OpenAPI): `http://localhost:8080/swagger-ui/index.html`
*(Bấm nút **Authorize** ở góc trên bên phải Swagger và dán token Bearer để kiểm thử các API được bảo mật).*

### Bước 3: Khởi động Frontend (ReactJS + Tailwind CSS)
```powershell
cd frontend
npm install
npm run dev
```
- Giao diện web chạy tại: `http://localhost:5173`

---

## 4. Danh Sách REST Endpoints

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register`: Đăng ký tài khoản hội viên mới (`MEMBER`).
- `POST /api/v1/auth/login`: Xác thực tài khoản, trả về Bearer JWT token.
- `GET /api/v1/auth/me`: Lấy thông tin tài khoản hiện tại từ JWT token.

### Admin User Management (`/api/v1/admin/users`) — Yêu cầu quyền `ADMIN`
- `GET /api/v1/admin/users`: Lấy danh sách người dùng với phân trang `Pageable`, tìm kiếm keyword (Tên, Email, SĐT), lọc theo `role` và `isActive`.
- `POST /api/v1/admin/users`: Tạo tài khoản nhân sự mới (Coach, Lễ tân, Admin).
- `PATCH /api/v1/admin/users/{id}/status`: Kích hoạt / Khóa tài khoản người dùng.
- `GET /api/v1/admin/users/{id}`: Xem chi tiết thông tin tài khoản theo ID.
