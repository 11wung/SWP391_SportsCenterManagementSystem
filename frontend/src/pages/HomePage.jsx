import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/Badge';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  ShieldCheck,
  Calendar,
  CreditCard,
  Flame,
  Award,
  ArrowRight,
  Activity,
} from 'lucide-react';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      {/* Hero Header */}
      <div className="relative border-b border-slate-800 bg-slate-900/40 py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="gradient-glow top-0 right-1/4 w-96 h-96 bg-brand-600 rounded-full" />
        <div className="mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider text-slate-400">
                Xin chào trở lại,
              </span>
              <RoleBadge role={user?.role} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {user?.fullName || 'Hội viên'}
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Chào mừng bạn đến với hệ thống Sports Center Pro. Theo dõi lịch trình tập luyện, gói tập và các lớp thể thao chuyên sâu.
            </p>
          </div>

          {user?.role === 'ADMIN' && (
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-xl shadow-brand-500/25 transition self-start md:self-auto"
            >
              <ShieldCheck className="h-5 w-5" />
              Truy cập Quản trị Nhân sự
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 mb-4 border border-brand-500/30">
              <Flame className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Gói tập hội viên
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Gói All-Access 12 tháng không giới hạn phòng tập gym và lớp yoga.
            </p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
              <span className="text-slate-400">Trạng thái</span>
              <span className="text-emerald-400 font-medium">Đang kích hoạt</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400 mb-4 border border-sky-500/30">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Lớp học tiếp theo
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Pilates & Core Conditioning cùng HLV Trần Thị Mai lúc 18:30 hôm nay.
            </p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
              <span className="text-slate-400">Phòng tập</span>
              <span className="text-slate-200 font-medium">Phòng Studio A</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 mb-4 border border-amber-500/30">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Chỉ số sức khỏe
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Buổi đo InBody định kỳ tiếp theo vào ngày 25 hàng tháng cùng HLV.
            </p>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
              <span className="text-slate-400">Tỉ lệ cơ bắp</span>
              <span className="text-amber-400 font-mono font-medium">+1.8% tháng này</span>
            </div>
          </div>
        </div>

        {/* Quick Account Profile Card */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5 text-brand-400" />
            <h2 className="text-lg font-bold text-white">
              Thông Tin Hồ Sơ Cá Nhân
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Họ và tên</span>
              <span className="text-slate-200 font-semibold">{user?.fullName}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Email đăng ký</span>
              <span className="text-slate-200 font-mono">{user?.email}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Số điện thoại</span>
              <span className="text-slate-200 font-mono">{user?.phone || 'Chưa cập nhật'}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Quyền hạn hệ thống</span>
              <span className="text-brand-400 font-semibold">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
