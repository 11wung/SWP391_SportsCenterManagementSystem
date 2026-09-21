# TÀI LIỆU ĐẶC TẢ NGHIỆP VỤ HỆ THỐNG
## SPORTS CENTER MANAGEMENT SYSTEM (HỆ THỐNG QUẢN LÝ TRUNG TÂM THỂ THAO ĐA NĂNG)
> **Mã dự án**: SWP391_SportsCenterManagementSystem  
> **Phiên bản tài liệu**: 1.0  
> **Đối tượng sử dụng**: Giảng viên hướng dẫn, Nhóm sinh viên phát triển, Quản trị viên, Nhân sự trung tâm  

---

## MỤC LỤC
1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Các Đối Tượng Người Dùng (Actors & Roles)](#2-các-đối-tượng-người-dùng-actors--roles)
3. [Ma Trận Phân Quyền Hệ Thống (RBAC Matrix)](#3-ma-trận-phân-quyền-hệ-thống-rbac-matrix)
4. [Đặc Tả Chi Tiết 8 Phân Hệ Nghiệp Vụ Chính](#4-đặc-tả-chi-tiết-8-phân-hệ-nghiệp-vụ-chính)
   - [Phân hệ 1: Quản lý Người Dùng & Xác Thực (Users & Authentication)](#phân-hệ-1-quản-lý-người-dùng--xác-thực)
   - [Phân hệ 2: Quản lý Gói Tập & Thẻ Hội Viên (Membership Packages & Subscriptions)](#phân-hệ-2-quản-lý-gói-tập--thẻ-hội-viên)
   - [Phân hệ 3: Quản lý Thanh Toán & Hóa Đơn (Billing & Payments)](#phân-hệ-3-quản-lý-thanh-toán--hóa-đơn)
   - [Phân hệ 4: Quản lý Cơ Sở Vật Chất & Phòng Tập (Facilities & Rooms)](#phân-hệ-4-quản-lý-cơ-sở-vật-chất--phòng-tập)
   - [Phân hệ 5: Quản lý Bộ Môn, Lớp Học & Lịch Dạy (Sport Classes & Schedules)](#phân-hệ-5-quản-lý-bộ-môn-lớp-học--lịch-dạy)
   - [Phân hệ 6: Đăng Ký Lớp & Điểm Danh Ra Vào (Registrations & Attendances)](#phân-hệ-6-đăng-ký-lớp--điểm-danh-ra-vào)
   - [Phân hệ 7: Kế Hoạch Tập Luyện & Theo Dõi Sức Khỏe (Workout & Health Progress)](#phân-hệ-7-kế-hoạch-tập-luyện--theo-dõi-sức-khỏe)
   - [Phân hệ 8: Nhật Ký Hệ Thống & Giám Sát (Audit Logs & Tracking)](#phân-hệ-8-nhật-ký-hệ-thống--giám-sát)
5. [Sơ Đồ Vòng Đời & Trạng Thái Dữ Liệu (State Lifecycle)](#5-sơ-đồ-vòng-đời--trạng-thái-dữ-liệu)
6. [Các Quy Tắc Nghiệp Vụ Ràng Buộc Bắt Buộc (Business Rules)](#6-các-quy-tắc-nghiệp-vụ-ràng-buộc-bắt-buộc)

---

## 1. TỔNG QUAN HỆ THỐNG

**Sports Center Management System** là nền tảng quản trị tổng thể cho các tổ hợp trung tâm thể thao đa năng (bao gồm Gym thể hình, Yoga, Pilates, Boxing, Bơi lội, Nhảy hiện đại, v.v.).

### Mục tiêu giải pháp:
- **Tự động hóa quy trình vận hành**: Giảm tải thao tác thủ công của Lễ tân và Ban quản lý (soát vé, điểm danh, thu phí, xếp phòng).
- **Tối ưu hóa nguồn lực trung tâm**: Tránh trùng lịch phòng tập, kiểm soát sĩ số lớp học và phân bổ lịch dạy của Huấn luyện viên hiệu quả.
- **Nâng cao trải nghiệm hội viên**: Cho phép hội viên chủ động đăng ký gói tập, theo dõi lịch trình, điểm danh số hóa và đo lường sự tiến bộ về thể hình (InBody tracking).
- **Minh bạch tài chính & An toàn dữ liệu**: Kiểm soát dòng tiền, bảo vệ phân quyền chặt chẽ bằng Bearer JWT và lưu trữ nhật ký kiểm toán (Audit Log).

---

## 2. CÁC ĐỐI TƯỢNG NGƯỜI DÙNG (ACTORS & ROLES)

Hệ thống phân định rõ ràng 4 nhóm vai trò (Roles) với phạm vi nghiệp vụ chuyên biệt:

```
                  ┌─────────────────────────────────────────┐
                  │    SPORTS CENTER MANAGEMENT SYSTEM      │
                  └────────────────────┬────────────────────┘
          ┌─────────────────┬──────────┴──────────┬─────────────────┐
          ▼                 ▼                     ▼                 ▼
   ┌─────────────┐   ┌─────────────┐       ┌─────────────┐   ┌─────────────┐
   │    ADMIN    │   │    COACH    │       │RECEPTIONIST │   │   MEMBER    │
   │ (Quản trị)  │   │  (HLV / PT) │       │  (Lễ tân)   │   │ (Hội viên)  │
   └─────────────┘   └─────────────┘       └─────────────┘   └─────────────┘
```

| Vai trò (Role) | Mã quyền | Trách nhiệm chính |
|---|---|---|
| **Quản trị viên** | `ADMIN` | Toàn quyền kiểm soát hệ thống: quản lý tài khoản nhân sự, cấu hình gói tập, phân bổ phòng, xem báo cáo doanh thu và nhật ký kiểm toán. |
| **Huấn luyện viên** | `COACH` | Quản lý lớp học được phân công, điểm danh học viên từng buổi dạy, tạo giáo án tập luyện và cập nhật chỉ số đo cơ thể cho hội viên. |
| **Lễ tân** | `RECEPTIONIST` | Tiếp đón khách, check-in/check-out lượt ra vào trung tâm, tư vấn và đăng ký gói tập mới, thu tiền và xuất biên lai thanh toán. |
| **Hội viên** | `MEMBER` | Khách hàng tập luyện: xem thông tin gói tập hiện có, đăng ký lớp học, xem lịch tập cá nhân, theo dõi biểu đồ tăng cơ giảm mỡ. |

---

## 3. MA TRẬN PHÂN QUYỀN HỆ THỐNG (RBAC MATRIX)

Ký hiệu: **C** (Create - Tạo), **R** (Read - Xem), **U** (Update - Sửa), **D** (Delete/Status Toggle - Khóa/Xóa).

| Phân hệ / Chức năng | Bảng dữ liệu tương ứng | ADMIN | RECEPTIONIST | COACH | MEMBER |
|---|---|:---:|:---:|:---:|:---:|
| **Quản lý Tài khoản & Phân quyền** | `users` | **CRUD** | **R** (khách) | **R** (bản thân) | **R** (bản thân) |
| **Gói tập trung tâm** | `membership_packages` | **CRUD** | **R** | **R** | **R** |
| **Đăng ký gói tập hội viên** | `member_subscriptions` | **CRUD** | **CRU** | **R** | **R** (của mình) |
| **Hóa đơn & Thu tiền** | `payments` | **CRUD** | **CRU** | ❌ | **R** (của mình) |
| **Phòng tập & Cơ sở vật chất** | `facility_rooms` | **CRUD** | **R** | **R** | **R** |
| **Danh mục bộ môn** | `sport_categories` | **CRUD** | **R** | **R** | **R** |
| **Lớp học & Lịch dạy** | `sport_classes`, `class_schedules` | **CRUD** | **R** | **RU** (lớp mình) | **R** |
| **Đăng ký lớp học** | `class_registrations` | **CRUD** | **CRUD** | **R** | **CR** (lớp mình) |
| **Điểm danh cửa ra vào** | `facility_attendances` | **CRUD** | **CRUD** | **R** | **R** (lịch sử mình) |
| **Điểm danh buổi học** | `class_attendances` | **CRUD** | **R** | **CRUD** (lớp dạy) | **R** (lịch sử mình) |
| **Lộ trình tập cá nhân** | `workout_plans` | **CRUD** | ❌ | **CRUD** (học viên) | **R** (kế hoạch mình) |
| **Chỉ số thể hình (InBody)** | `workout_progress` | **CRUD** | ❌ | **CRUD** | **R** (biểu đồ mình) |
| **Nhật ký kiểm toán** | `audit_logs` | **R** | ❌ | ❌ | ❌ |

---

## 4. ĐẶC TẢ CHI TIẾT 8 PHÂN HỆ NGHIỆP VỤ CHÍNH

### Phân hệ 1: Quản lý Người Dùng & Xác Thực
- **Đăng ký hội viên công khai (`POST /api/v1/auth/register`)**:
  * Người dùng tự điền: Họ tên, Email, Số điện thoại (chuẩn 10 số VN: đầu số 03, 05, 07, 08, 09), Giới tính, Mật khẩu (tối thiểu 8 ký tự).
  * Vai trò mặc định luôn gán là `MEMBER`.
  * Trạng thái kích hoạt mặc định là `is_active = true`.
- **Đăng nhập hệ thống (`POST /api/v1/auth/login`)**:
  * Xác thực bằng Email và Password đã mã hóa bằng `BCrypt`.
  * Trả về Bearer JWT token có chứa `userId`, `email`, `role`. Token có hiệu lực 24 giờ.
  * Nếu tài khoản có `is_active = false`, từ chối đăng nhập và báo: *"Tài khoản đã bị vô hiệu hóa hoặc chưa kích hoạt"*.
- **Quản trị nhân sự (`POST /api/v1/admin/users`)**:
  * Chỉ `ADMIN` mới có quyền tạo tài khoản `COACH` hoặc `RECEPTIONIST`.
  * Mật khẩu có thể chỉ định hoặc nhận giá trị mặc định hệ thống.
- **Khóa / Mở khóa tài khoản (`PATCH /api/v1/admin/users/{id}/status`)**:
  * `ADMIN` có thể đình chỉ hoạt động của nhân viên hoặc hội viên vi phạm nội quy.

---

### Phân hệ 2: Quản lý Gói Tập & Thẻ Hội Viên
- **Định nghĩa Gói tập (`membership_packages`)**:
  * Ví dụ: *Gói Gym 1 Tháng, Gói All-Access 1 Năm, Gói Yoga VIP, Gói HLV kèm riêng*.
  * Thông số gói: `name` (Tên gói), `code` (Mã gói, duy nhất), `duration_months` (Thời hạn: 1, 3, 6, 12 tháng), `price` (Đơn giá VNĐ), `max_class_per_week` (Số buổi học nhóm tối đa/tuần, nếu bằng 0 là không giới hạn).
- **Bán gói tập cho Hội viên (`member_subscriptions`)**:
  * Lễ tân chọn Hội viên và Gói tập muốn mua.
  * Hệ thống tự động tính ngày bắt đầu `start_date` (mặc định ngày hiện tại) và ngày kết thúc `end_date = start_date + duration_months`.
  * Trạng thái gói:
    - `ACTIVE`: Thẻ đang có hiệu lực tập luyện.
    - `EXPIRED`: Hết hạn ngày kết thúc.
    - `SUSPENDED`: Hội viên yêu cầu bảo lưu thẻ (tạm dừng tính ngày trong thời gian công tác/nghỉ ốm).
    - `CANCELLED`: Thẻ bị hủy.

---

### Phân hệ 3: Quản lý Thanh Toán & Hóa Đơn
- **Quy trình lập hóa đơn (`payments`)**:
  * Mỗi giao dịch gắn với một lượt đăng ký gói tập `subscription_id` và người trả `user_id`.
  * Phương thức thanh toán (`payment_method`): `CASH` (Tiền mặt), `CREDIT_CARD` (Thẻ quẹt POS), `BANK_TRANSFER` (Chuyển khoản QR), `MOMO`, `VNPAY`.
  * Mã giao dịch `transaction_code`: Định danh duy nhất để đối soát kế toán.
  * Trạng thái thanh toán (`status`): `PENDING` (Chờ thu) ➔ `SUCCESS` (Đã thanh toán) ➔ `FAILED` (Thất bại).
  * **Quy tắc**: Thẻ hội viên `member_subscriptions` chỉ chuyển sang trạng thái `ACTIVE` khi `payments.status = SUCCESS`.

---

### Phân hệ 4: Quản lý Cơ Sở Vật Chất & Phòng Tập
- **Quản lý phòng tập (`facility_rooms`)**:
  * Thuộc tính: `room_name` (Phòng Gym Tầng 1, Studio Yoga A, Sàn Boxing B), `capacity` (Sức chứa tối đa học viên cùng thời điểm), `floor` (Tầng lầu), `status` (`AVAILABLE` - Sẵn sàng, `MAINTENANCE` - Đang sửa chữa, `OCCUPIED` - Đang có lớp).
- **Phân loại bộ môn (`sport_categories`)**:
  * Các bộ môn trung tâm giảng dạy: Gym thể hình, Yoga asana, Pilates reformer, Kick-boxing, Zumba dance, Bơi lội.

---

### Phân hệ 5: Quản lý Bộ Môn, Lớp Học & Lịch Dạy
- **Khởi tạo lớp học (`sport_classes`)**:
  * Thuộc về một bộ môn cụ thể (`category_id`).
  * Chỉ định Huấn luyện viên phụ trách đứng lớp (`coach_id`).
  * Độ khó của lớp (`level`): `BEGINNER` (Cơ bản), `INTERMEDIATE` (Trung cấp), `ADVANCED` (Nâng cao).
  * Giới hạn sĩ số tối đa `max_capacity` (không được vượt quá sức chứa `facility_rooms.capacity` của phòng tổ chức).
- **Lập thời khóa biểu (`class_schedules`)**:
  * Gồm: `day_of_week` (Thứ 2 đến Chủ nhật: 1 ➔ 7), `start_time` và `end_time` (Khung giờ bắt đầu - kết thúc), `room_id` (Phòng diễn ra).
  * **Quy tắc chống trùng lịch (Conflict Validation)**: Hệ thống chặn không cho phép xếp 2 lớp diễn ra cùng 1 phòng, cùng 1 thứ và trùng khung giờ.

---

### Phân hệ 6: Đăng Ký Lớp & Điểm Danh Ra Vào
- **Đăng ký tham gia lớp (`class_registrations`)**:
  * Hội viên chọn lớp phù hợp trên hệ thống để ghi danh.
  * Hệ thống kiểm tra:
    1. Gói tập của hội viên có còn `ACTIVE` không?
    2. Sĩ số lớp hiện tại đã đạt `max_capacity` chưa? (Nếu đã đầy thì chặn).
    3. Số lớp đăng ký trong tuần có vượt quá `max_class_per_week` quy định của gói không?
  * Đạt điều kiện ➔ Lưu trạng thái `ENROLLED`.
- **Điểm danh cửa ra vào trung tâm (`facility_attendances`)**:
  * Lễ tân quét mã QR hoặc thẻ hội viên tại quầy cửa ra vào.
  * Ghi nhận `check_in_time` khi khách vào tập và `check_out_time` khi khách ra về.
- **Điểm danh từng buổi học chuyên sâu (`class_attendances`)**:
  * Đến giờ học, HLV mở danh sách học viên đã `ENROLLED`.
  * HLV tích chọn trạng thái điểm danh:
    - `PRESENT`: Có mặt đúng giờ.
    - `ABSENT`: Vắng mặt không lý do.
    - `EXCUSED`: Nghỉ có báo trước (không bị trừ buổi bảo lưu).

---

### Phân hệ 7: Kế Hoạch Tập Luyện & Theo Dõi Sức Khỏe
- **Giáo án tập luyện cá nhân hóa (`workout_plans`)**:
  * HLV thiết kế lộ trình mục tiêu cho học viên (Ví dụ: *"Giảm 4kg mỡ thừa trong 8 tuần"*, *"Tăng cơ thân trên"*).
  * Gồm tiêu đề, mô tả bài tập, ngày bắt đầu và ngày kết thúc dự kiến.
- **Theo dõi chỉ số sinh trắc học InBody (`workout_progress`)**:
  * Định kỳ hàng tuần hoặc hàng tháng, học viên được đo các chỉ số:
    - Cân nặng (`weight_kg`)
    - Chiều cao (`height_cm`) ➔ Tính ra BMI
    - Tỷ lệ mỡ cơ thể (`body_fat_pct` - %)
    - Khối lượng cơ bắp (`muscle_mass_kg` - kg)
    - Ghi chú dinh dưỡng (`notes`)
  * Frontend hiển thị biểu đồ đường (Line chart) để hội viên trực quan hóa sự cải thiện sức khỏe.

---

### Phân hệ 8: Nhật Ký Hệ Thống & Giám Sát (Audit Logs)
- Ghi lại tự động các biến động dữ liệu quan trọng phục vụ đối soát và an toàn thông tin:
  * `user_id`: Ai là người thực hiện hành động?
  * `action`: Thao tác gì? (`CREATE_USER`, `UPDATE_PACKAGE_PRICE`, `TOGGLE_USER_STATUS`, `CANCEL_SUBSCRIPTION`...)
  * `resource`: Bảng/Đối tượng nào bị tác động?
  * `payload_diff`: Cấu trúc JSONB lưu chi tiết thay đổi (Dữ liệu cũ ➔ Dữ liệu mới).
  * `created_at`: Dấu mốc thời gian chính xác tới mili-giây.

---

## 5. SƠ ĐỒ VÒNG ĐỜI & TRẠNG THÁI DỮ LIỆU

### 5.1. Vòng đời Gói tập Hội viên (Member Subscription)
```
          [Khách mua gói]
                 │
                 ▼
         ┌───────────────┐
         │    PENDING    │ (Chờ thanh toán)
         └───────┬───────┘
                 │
      Thanh toán thành công (payments: SUCCESS)
                 │
                 ▼
         ┌───────────────┐
   ┌────►│    ACTIVE     │◄────┐
   │     └───────┬───────┘     │
   │             │             │
Hết thời hạn     │ Khách xin   │ Hết hạn
bảo lưu          │ bảo lưu     │ bảo lưu
   │             ▼             │
   │     ┌───────────────┐     │
   └─────┤   SUSPENDED   ├─────┘
         └───────────────┘
                 │
                 ├── Đến ngày end_date ───────► ┌───────────────┐
                 │                              │    EXPIRED    │
                 │                              └───────────────┘
                 └── Vi phạm / Khách hủy ─────► ┌───────────────┐
                                                │   CANCELLED   │
                                                └───────────────┘
```

### 5.2. Vòng đời Lớp học (Sport Class)
```
  [Mở lớp mới] ──► [OPEN] (Mở đăng ký cho hội viên)
                      │
           Đủ sĩ số / Tới ngày học
                      │
                      ▼
               [IN_PROGRESS] (Lớp đang trong kỳ giảng dạy)
                      │
               Kết thúc khóa học
                      │
                      ▼
                   [CLOSED] (Lớp đã hoàn thành)
```

---

## 6. CÁC QUY TẮC NGHIỆP VỤ RÀNG BUỘC BẮT BUỘC (BUSINESS RULES)

1. **Ràng buộc duy nhất (Unique)**:
   - Email và Số điện thoại của người dùng phải là duy nhất trên toàn hệ thống.
   - Mã gói tập (`code`) và Mã giao dịch thanh toán (`transaction_code`) không được phép trùng lặp.
2. **Quy tắc về giá tiền & thời hạn**:
   - `price` và `total_amount` phải $\ge 0$.
   - `duration_months` phải là số nguyên dương $\ge 1$.
3. **Quy tắc xếp phòng học (Room Conflict Prevention)**:
   - Tại cùng một phòng tập `facility_rooms`, cùng một thứ trong tuần `day_of_week`, không được tồn tại hai lịch dạy có khoảng thời gian `[start_time, end_time]` giao nhau.
4. **Quy tắc sĩ số (Capacity Constraint)**:
   - Sĩ số tối đa của lớp học `sport_classes.max_capacity` không được vượt quá sức chứa thực tế `facility_rooms.capacity` của phòng học tương ứng.
5. **Quy tắc ghi danh lớp (Registration Integrity)**:
   - Một hội viên không được phép đăng ký 2 lần vào cùng 1 lớp học (Ràng buộc `uq_class_member (class_id, member_id)`).
   - Hội viên chỉ được đăng ký lớp học khi gói thẻ đang ở trạng thái `ACTIVE`.
6. **Quy tắc bảo vệ dữ liệu kiểm toán (Audit Immutability)**:
   - Bảng `audit_logs` là bảng chỉ ghi (Append-only), không cung cấp bất kỳ API nào cho phép sửa (`UPDATE`) hoặc xóa (`DELETE`) nhật ký.
