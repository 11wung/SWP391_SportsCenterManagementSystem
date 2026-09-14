# HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY HỆ THỐNG
> **Dành cho sinh viên & nhóm phát triển Sports Center Management System**  
> *Hỗ trợ 2 phương thức: Chạy tự động hoàn toàn bằng Docker hoặc chạy Local từng phần*

---

## 0. CẤU HÌNH BIẾN MÔI TRƯỜNG (.ENV)
Dự án đã chuẩn bị sẵn các file mẫu `.env.example` và file cấu hình `.env` cho từng tầng:

```
/
├── .env.example & .env          # Cấu hình chung cho Docker Compose (Port, DB, pgAdmin)
├── backend/
│   └── .env.example & .env      # Cấu hình Spring Boot (Port, Database, JWT Secret)
└── frontend/
    └── .env.example & .env      # Cấu hình React (VITE_API_BASE_URL)
```

> 💡 **Lưu ý cho sinh viên:**
> - File `.env` chứa các thông số nhạy cảm (mật khẩu, khóa bí mật JWT) nên đã được cấu hình trong `.gitignore` (không đẩy lên Git).
> - Khi clone dự án lần đầu, nếu chưa có file `.env`, bạn chỉ cần sao chép từ file mẫu:
>   ```powershell
>   # Tại thư mục gốc:
>   Copy-Item .env.example .env
>   Copy-Item backend/.env.example backend/.env
>   Copy-Item frontend/.env.example frontend/.env
>   ```
> - Giá trị mặc định trong `.env` đã được thiết lập sẵn để chạy ngay lập tức mà không cần chỉnh sửa!

---

## BẢNG CHỌN PHƯƠNG THỨC KHỞI CHẠY

| Trường hợp của bạn | Phương thức khuyên dùng | Yêu cầu cài đặt trên máy |
|---|---|---|
| Máy bị lỗi môi trường Java/Node, ngại cài đặt phức tạp | **CÁCH 1: Chạy Full Stack với Docker** | Chỉ cần cài [Docker Desktop](https://www.docker.com/products/docker-desktop/) |
| Muốn code và debug nhanh Backend/Frontend trên IDE | **CÁCH 2: Chạy Local (Profile Dev H2)** | Cài [JDK 21](https://adoptium.net/) & [Node.js LTS](https://nodejs.org/) (Không cần cài PostgreSQL) |
| Muốn chạy Local với Database PostgreSQL thật | **CÁCH 3: Chạy Local + Docker Postgres** | Cài JDK 21, Node.js + Docker để chạy DB |

---

## CÁCH 1: CHẠY FULL STACK BẰNG DOCKER (KHUYÊN DÙNG KHI MÁY LỖI MÔI TRƯỜNG)
> *Chỉ với 1 câu lệnh, toàn bộ PostgreSQL 16, Spring Boot 3 Backend, React Frontend (Nginx) và pgAdmin sẽ tự động tải, build và chạy mà không cần cài đặt Java hay Node.js trên máy tính.*

### Bước 1: Mở Docker Desktop
Đảm bảo phần mềm **Docker Desktop** trên máy đã được mở và biểu tượng cá voi ở góc màn hình báo màu xanh (Engine running).

### Bước 2: Chạy lệnh khởi động
Mở PowerShell hoặc Command Prompt tại thư mục gốc của dự án (`swp`):
```powershell
docker compose up --build -d
```

### Bước 3: Truy cập hệ thống
Sau khi các container khởi động thành công:
- **Giao diện Web (Frontend)**: [http://localhost:5173](http://localhost:5173) hoặc [http://localhost](http://localhost)
- **Backend API Docs (Swagger UI)**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Quản lý Database (pgAdmin 4)**: [http://localhost:5050](http://localhost:5050)
  * Email: `admin@sportcenter.com`
  * Mật khẩu: `Admin@123456`

### Các lệnh Docker hữu ích:
- **Xem log thời gian thực của backend**:
  ```powershell
  docker compose logs -f backend
  ```
- **Dừng toàn bộ hệ thống**:
  ```powershell
  docker compose down
  ```
- **Xóa sạch dữ liệu database để tạo lại từ đầu**:
  ```powershell
  docker compose down -v
  ```

---

## CÁCH 2: CHẠY LOCAL (KHÔNG CẦN CÀI POSTGRESQL - DÙNG H2 DATABASE)
> *Dành cho việc lập trình, sửa code và debug trực tiếp trên IntelliJ IDEA / VS Code.*

### Bước 1: Yêu cầu chuẩn bị
- Đã cài **Java JDK 21** trở lên (Kiểm tra: `java -version`).
- Đã cài **Node.js LTS** (Kiểm tra: `node -v` và `npm -v`).
- Dự án đã tích hợp sẵn **Maven Wrapper (`mvnw.cmd`)**, bạn **KHÔNG CẦN CÀI MAVEN**.

### Bước 2: Khởi động Backend với Profile Dev (H2 In-Memory)
Mở PowerShell tại thư mục `swp/backend`:
```powershell
cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```
*(Nếu dùng macOS/Linux hoặc Git Bash, thay `.\mvnw.cmd` bằng `./mvnw`)*

- Backend sẽ khởi động tại cổng `8080`.
- Cơ sở dữ liệu H2 sẽ tự động được tạo trong RAM và DataSeeder sẽ nạp sẵn 8 tài khoản mẫu.
- Trang Swagger UI kiểm thử API: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- Trang H2 Console (tùy chọn): [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:mem:sportscenterdb`, User: `sa`, Password: để trống).

### Bước 3: Khởi động Frontend React
Mở thêm một cửa sổ PowerShell mới tại thư mục `swp/frontend`:
```powershell
cd frontend
npm install
npm run dev
```
- Frontend sẽ chạy tại địa chỉ: [http://localhost:5173](http://localhost:5173)

---

## CÁCH 3: CHẠY LOCAL KẾT HỢP DOCKER POSTGRESQL THẬT
Nếu bạn muốn debug code Java/React trên máy nhưng muốn lưu dữ liệu vào PostgreSQL thật:

1. **Khởi động riêng container PostgreSQL**:
   ```powershell
   docker compose up -d postgres
   ```
2. **Khởi động Backend**:
   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
3. **Khởi động Frontend**:
   ```powershell
   cd frontend
   npm run dev
   ```

---

## BẢNG TÀI KHOẢN MẪU ĐĂNG NHẬP SẴN (ĐÃ NẠP QUA SEEDER)

Hệ thống đã chuẩn bị sẵn tài khoản cho từng phân quyền:

| Vai trò | Email đăng nhập | Mật khẩu mặc định | Chức năng chính |
|---|---|---|---|
| **ADMIN** | `admin@sportcenter.com` | `Admin@123456` | Quản trị toàn hệ thống, tạo nhân sự, đổi trạng thái |
| **COACH** | `coach1@sportcenter.com` | `Coach@123456` | Huấn luyện viên thể hình, tạo lịch tập, điểm danh lớp |
| **COACH** | `coach2@sportcenter.com` | `Coach@123456` | Huấn luyện viên Yoga |
| **RECEPTIONIST** | `receptionist@sportcenter.com` | `Recep@123456` | Lễ tân check-in, gia hạn thẻ, bán gói tập |
| **MEMBER** | `member1@sportcenter.com` | `Member@123456` | Hội viên xem lịch, đăng ký lớp tập |

*Mẹo: Trên giao diện Đăng nhập ([http://localhost:5173/login](http://localhost:5173/login)), có sẵn 4 nút bấm tiện ích **Tài khoản dùng thử nhanh** để tự động điền tài khoản chỉ với 1 click!*

---

## XỬ LÝ CÁC SỰ CỐ MÔI TRƯỜNG THƯỜNG GẶP (TROUBLESHOOTING)

### 1. Lỗi PowerShell: "running scripts is disabled on this system"
- **Nguyên nhân**: Chính sách bảo mật của Windows chặn chạy file script `.ps1`.
- **Cách khắc phục**: Mở PowerShell bằng quyền Administrator và gõ:
  ```powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
  Sau đó bấm `Y` và Enter.

### 2. Lỗi cổng bị chiếm dụng: "Port 8080 / 5173 / 5432 is already in use"
- **Nguyên nhân**: Có ứng dụng khác (hoặc tiến trình cũ chưa tắt) đang chiếm cổng này.
- **Cách khắc phục**: Chạy lệnh sau trong PowerShell để tìm và tắt tiến trình đang chiếm cổng:
  ```powershell
  # Tìm và dừng tiến trình chiếm cổng 8080
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess -Force

  # Tìm và dừng tiến trình chiếm cổng 5173
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess -Force
  ```

### 3. Lỗi phiên bản Java: "class file has wrong version 65.0" hoặc "Java 21 required"
- **Nguyên nhân**: Máy bạn đang cài Java cũ (Java 8 hoặc Java 11). Dự án này yêu cầu **Java 21**.
- **Cách khắc phục**:
  - Tải và cài đặt JDK 21 tại: [https://adoptium.net/temurin/releases/?version=21](https://adoptium.net/temurin/releases/?version=21)
  - Đảm bảo biến môi trường `JAVA_HOME` trỏ tới thư mục cài đặt JDK 21.
  - Hoặc đơn giản nhất: **Sử dụng CÁCH 1 (Docker)** để không cần bận tâm cài Java trên máy!

### 4. Lỗi Docker Desktop: "WSL 2 installation is incomplete"
- **Nguyên nhân**: Docker trên Windows cần nhân Linux WSL 2 để vận hành.
- **Cách khắc phục**: Mở PowerShell (Admin) và chạy:
  ```powershell
  wsl --update
  ```
  Sau đó khởi động lại Docker Desktop.

### 5. Lỗi Maven tải thư viện bị ngắt kết nối mạng
- **Cách khắc phục**: Chạy lệnh ép buộc cập nhật lại dependencies:
  ```powershell
  cd backend
  .\mvnw.cmd clean package -U -DskipTests
  ```

### 6. Lỗi Swagger UI không gửi được Bearer Token
- **Cách khắc phục**:
  1. Gọi API `POST /api/v1/auth/login` trên Swagger hoặc Postman để lấy chuỗi `accessToken`.
  2. Bấm vào nút **Authorize** màu xanh ở góc trên bên phải trang Swagger UI.
  3. Dán chuỗi token vào ô Value và bấm **Authorize** -> **Close**.
  4. Bây giờ các request test API sẽ tự động được đính kèm token!
