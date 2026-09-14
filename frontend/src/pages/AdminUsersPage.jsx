import React, { useState, useEffect, useCallback } from 'react';
import { userApi } from '../api/userApi';
import { Table } from '../components/Table';
import { RoleBadge, StatusBadge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  RefreshCw,
  Power,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Shield,
  Activity,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const AdminUsersPage = () => {
  // Data state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });

  // Filter state
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal create staff state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'COACH',
    password: '',
    gender: 'MALE',
  });

  // Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
      };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (roleFilter) params.role = roleFilter;
      if (statusFilter !== '') params.isActive = statusFilter === 'true';

      const res = await userApi.getUsers(params);
      if (res && res.data) {
        setUsers(res.data.content || []);
        setPagination((prev) => ({
          ...prev,
          page: res.data.page,
          size: res.data.size,
          totalElements: res.data.totalElements,
          totalPages: res.data.totalPages,
          last: res.data.last,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showToast(err.response?.data?.message || 'Không thể tải danh sách người dùng', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, keyword, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  // Reset Filters
  const handleResetFilters = () => {
    setKeyword('');
    setRoleFilter('');
    setStatusFilter('');
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  // Toggle User Active Status
  const handleToggleStatus = async (user) => {
    try {
      const newStatus = !user.isActive;
      await userApi.updateUserStatus(user.id, newStatus);
      showToast(
        `Đã ${newStatus ? 'kích hoạt' : 'khóa'} tài khoản: ${user.fullName}`,
        'success'
      );
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: newStatus } : u))
      );
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Cập nhật trạng thái thất bại', 'error');
    }
  };

  // Handle Create Staff Modal
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setFormError('Vui lòng nhập đầy đủ Họ tên, Email và Số điện thoại');
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setFormError('Số điện thoại phải có 10 chữ số (bắt đầu bằng 03, 05, 07, 08, 09)');
      return;
    }

    setSubmittingUser(true);
    try {
      await userApi.createUser({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        gender: formData.gender,
        password: formData.password || undefined,
      });

      showToast(`Tạo tài khoản ${formData.role} thành công!`, 'success');
      setIsModalOpen(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: 'COACH',
        password: '',
        gender: 'MALE',
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Không thể tạo tài khoản');
    } finally {
      setSubmittingUser(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Table Columns Definition
  const columns = [
    {
      header: 'Người dùng',
      accessor: 'fullName',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-brand-400 font-bold text-xs ring-1 ring-brand-500/20">
            {getInitials(user.fullName)}
          </div>
          <div>
            <p className="font-semibold text-white hover:text-brand-300 transition">
              {user.fullName}
            </p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Số điện thoại',
      accessor: 'phone',
      render: (user) => (
        <span className="font-mono text-xs text-slate-300">
          {user.phone || '—'}
        </span>
      ),
    },
    {
      header: 'Vai trò',
      accessor: 'role',
      render: (user) => <RoleBadge role={user.role} />,
    },
    {
      header: 'Trạng thái',
      accessor: 'isActive',
      render: (user) => <StatusBadge isActive={user.isActive} />,
    },
    {
      header: 'Ngày tham gia',
      accessor: 'createdAt',
      render: (user) => (
        <span className="text-xs text-slate-400 font-mono">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
        </span>
      ),
    },
    {
      header: 'Hành động',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (user) => (
        <button
          onClick={() => handleToggleStatus(user)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
            user.isActive
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
          }`}
          title={user.isActive ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
        >
          <Power className="h-3.5 w-3.5" />
          {user.isActive ? 'Khóa' : 'Kích hoạt'}
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-md p-4 text-xs shadow-2xl animate-fade-in">
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          )}
          <span className="text-slate-200">{toast.message}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative border-b border-slate-800 bg-slate-900/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Shield className="h-4 w-4" />
              <span>Hệ Thống Quản Trị Trung Tâm</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Quản Lý Người Dùng & Nhân Sự
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Tra cứu, phân quyền và điều khiển trạng thái hoạt động của hội viên, HLV và nhân viên
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsers}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:text-white transition"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-brand-400' : ''}`} />
              Làm mới
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/20 transition"
            >
              <UserPlus className="h-4 w-4" />
              + Thêm nhân viên
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="glass-panel p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Tổng tài khoản</span>
              <Users className="h-4 w-4 text-brand-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {pagination.totalElements}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Trên toàn hệ thống</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400">Hội viên (Member)</span>
              <UserCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {users.filter((u) => u.role === 'MEMBER').length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Trong trang hiện tại</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-sky-400">Huấn luyện viên</span>
              <Activity className="h-4 w-4 text-sky-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {users.filter((u) => u.role === 'COACH').length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">HLV chuyên nghiệp</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-400">Lễ tân trung tâm</span>
              <Shield className="h-4 w-4 text-amber-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {users.filter((u) => u.role === 'RECEPTIONIST').length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Trực ca vận hành</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel rounded-2xl p-4 mb-6 border border-slate-800/90 shadow-xl">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-3"
          >
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo Tên, Email hoặc Số điện thoại..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 0 }));
                }}
                className="rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Tất cả vai trò</option>
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
                <option value="COACH">Huấn luyện viên (COACH)</option>
                <option value="RECEPTIONIST">Lễ tân (RECEPTIONIST)</option>
                <option value="MEMBER">Hội viên (MEMBER)</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 0 }));
                }}
                className="rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đang hoạt động</option>
                <option value="false">Đã khóa</option>
              </select>

              {/* Reset button */}
              {(keyword || roleFilter || statusFilter) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-200 transition"
                  title="Xóa bộ lọc"
                >
                  Xóa lọc
                </button>
              )}

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition flex items-center gap-1.5"
              >
                <Filter className="h-3.5 w-3.5" />
                Lọc
              </button>
            </div>
          </form>
        </div>

        {/* User Table */}
        <Table
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="Không có người dùng nào khớp với tiêu chí tìm kiếm"
        />

        {/* Spring Boot Page Pagination */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <p className="text-xs text-slate-400">
            Hiển thị{' '}
            <span className="font-semibold text-slate-200">
              {users.length > 0 ? pagination.page * pagination.size + 1 : 0}
            </span>{' '}
            -{' '}
            <span className="font-semibold text-slate-200">
              {Math.min(
                (pagination.page + 1) * pagination.size,
                pagination.totalElements
              )}
            </span>{' '}
            trên tổng số{' '}
            <span className="font-semibold text-brand-400">
              {pagination.totalElements}
            </span>{' '}
            tài khoản (Trang {pagination.page + 1}/{Math.max(pagination.totalPages, 1)})
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(0, prev.page - 1),
                }))
              }
              disabled={pagination.page === 0 || loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Trang trước
            </button>

            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-brand-400 font-semibold">
              {pagination.page + 1}
            </span>

            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
              disabled={pagination.last || loading || pagination.page + 1 >= pagination.totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Trang sau
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Add Staff */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm Nhân Sự Mới"
        description="Khởi tạo tài khoản Huấn luyện viên, Lễ tân hoặc Quản trị viên mới vào hệ thống"
      >
        {formError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            id="staff-fullname"
            label="Họ và tên nhân sự"
            name="fullName"
            placeholder="Ví dụ: Trần Quốc Toản"
            value={formData.fullName}
            onChange={handleFormChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="staff-email"
              label="Email"
              type="email"
              name="email"
              placeholder="staff@sportcenter.com"
              value={formData.email}
              onChange={handleFormChange}
              required
            />

            <Input
              id="staff-phone"
              label="Số điện thoại"
              name="phone"
              placeholder="0912345678"
              value={formData.phone}
              onChange={handleFormChange}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
              Vai trò công việc (Role)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'COACH', label: 'Huấn luyện viên', color: 'text-sky-400' },
                { value: 'RECEPTIONIST', label: 'Lễ tân', color: 'text-amber-400' },
                { value: 'ADMIN', label: 'Quản trị viên', color: 'text-rose-400' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: item.value }))
                  }
                  className={`py-2 px-2 text-center text-xs font-medium rounded-xl border transition ${
                    formData.role === item.value
                      ? 'border-brand-500 bg-brand-500/20 text-white font-semibold'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={item.color}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            id="staff-password"
            label="Mật khẩu khởi tạo (để trống = Default@123456)"
            type="password"
            name="password"
            placeholder="Tối thiểu 8 ký tự hoặc để trống"
            value={formData.password}
            onChange={handleFormChange}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submittingUser}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/25 transition disabled:opacity-60"
            >
              {submittingUser ? 'Đang khởi tạo...' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
