import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Forbidden = () => {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden text-center">
      <div className="gradient-glow top-1/3 left-1/3 w-96 h-96 bg-rose-600 rounded-full opacity-20" />

      <div className="relative w-full max-w-md glass-card rounded-2xl p-8 shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mb-6 shadow-lg shadow-rose-500/10">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-3">
          Lỗi 403: Forbidden
        </span>

        <h1 className="text-xl font-bold text-white mb-2">
          Truy Cập Bị Từ Chối
        </h1>

        <p className="text-sm text-slate-400 mb-6">
          Bạn không có quyền truy cập vào tài nguyên hoặc chức năng này. Trang này chỉ dành riêng cho Quản trị viên (ADMIN).
        </p>

        {user && (
          <div className="mb-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 text-left">
            <p>
              Tài khoản hiện tại:{' '}
              <span className="font-semibold text-slate-200">{user.email}</span>
            </p>
            <p className="mt-1">
              Vai trò:{' '}
              <span className="font-semibold text-rose-400">{user.role}</span>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Về Trang Chủ
          </Link>
          <button
            onClick={logout}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition"
          >
            <LogIn className="h-4 w-4" />
            Đổi Tài Khoản
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
