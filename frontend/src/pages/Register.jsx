import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { Input } from '../components/Input';
import { User, Mail, Phone, Lock, Eye, EyeOff, Dumbbell, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'MALE',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Email không đúng định dạng';
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại phải đúng chuẩn 10 chữ số (bắt đầu bằng 03, 05, 07, 08, 09)';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      await authApi.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        password: formData.password,
      });

      navigate('/login', { state: { registered: true } });
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Đăng ký không thành công. Vui lòng thử lại.';
      setGeneralError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
      {/* Background Glows */}
      <div className="gradient-glow top-1/4 left-1/4 w-96 h-96 bg-brand-600 rounded-full" />
      <div className="gradient-glow bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600 rounded-full" />

      <div className="relative w-full max-w-lg">
        {/* Logo Card */}
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-xl shadow-brand-500/25 mb-3 ring-1 ring-white/20">
            <Dumbbell className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Gia Nhập Sports Center
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Đăng ký tài khoản hội viên để trải nghiệm hệ sinh thái tập luyện chuyên nghiệp
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          {generalError && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="register-fullname"
              label="Họ và tên"
              name="fullName"
              placeholder="Nguyễn Văn A"
              icon={User}
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="register-email"
                label="Email"
                name="email"
                type="email"
                placeholder="user@example.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <Input
                id="register-phone"
                label="Số điện thoại"
                name="phone"
                placeholder="0912345678"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Giới tính
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'MALE', label: 'Nam' },
                  { value: 'FEMALE', label: 'Nữ' },
                  { value: 'OTHER', label: 'Khác' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, gender: item.value }))
                    }
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition ${
                      formData.gender === item.value
                        ? 'border-brand-500 bg-brand-500/20 text-brand-300 font-semibold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="register-password"
                label="Mật khẩu (>= 8 ký tự)"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
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

              <Input
                id="register-confirm-password"
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-lg shadow-brand-500/25 transition disabled:opacity-60"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Tạo tài khoản hội viên'
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-400">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="font-medium text-brand-400 hover:text-brand-300 hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
