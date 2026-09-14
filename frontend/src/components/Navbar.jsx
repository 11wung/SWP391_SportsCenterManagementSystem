import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from './Badge';
import { Dumbbell, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-wide flex items-center gap-1.5">
                SPORTS CENTER <span className="text-xs px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-mono">PRO</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Management System
              </p>
            </div>
          </Link>

          {/* User Profile & Actions */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-slate-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-brand-400 font-semibold text-xs ring-2 ring-brand-500/30">
                  {getInitials(user.fullName)}
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {user.fullName}
                  </p>
                  <div className="mt-0.5">
                    <RoleBadge role={user.role} />
                  </div>
                </div>
              </div>

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/users"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 border border-slate-700/60 transition"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
                  Quản trị
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition"
                title="Đăng xuất"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
