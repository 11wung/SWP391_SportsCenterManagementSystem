import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Mail, Lock, Eye, EyeOff, Dumbbell, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registeredSuccess = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(email.trim(), password);
      // Navigate according to user role
      if (user.role === 'ADMIN') {
        navigate('/admin/users');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
      {/* Background Glows */}
      <div className="gradient-glow top-1/4 left-1/4 w-96 h-96 bg-brand-600 rounded-full" />
      <div className="gradient-glow bottom-1/4 right-1/4 w-96 h-96 bg-sky-600 rounded-full" />

      <div className="relative w-full max-w-md">
        {/* Logo Card */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-xl shadow-brand-500/25 mb-4 ring-1 ring-white/20">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sports Center Pro
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Hệ thống Quản lý Trung tâm Thể thao Đa năng
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">
            Đăng nhập hệ thống
          </h2>

          {registeredSuccess && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Đăng ký thành công! Hãy đăng nhập bằng tài khoản vừa tạo.</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="login-email"
              label="Email"
              type="email"
              placeholder="admin@sportcenter.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="login-password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-200 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-lg shadow-brand-500/25 transition disabled:opacity-60"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>



          <div className="mt-5 text-center">
            <p className="text-xs text-slate-400">
              Chưa có tài khoản hội viên?{' '}
              <Link
                to="/register"
                className="font-medium text-brand-400 hover:text-brand-300 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
