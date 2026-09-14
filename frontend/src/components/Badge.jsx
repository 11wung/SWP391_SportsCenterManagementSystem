import React from 'react';

export const RoleBadge = ({ role }) => {
  const roleConfig = {
    ADMIN: {
      label: 'Quản trị viên',
      bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400',
    },
    COACH: {
      label: 'Huấn luyện viên',
      bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      dot: 'bg-sky-400',
    },
    RECEPTIONIST: {
      label: 'Lễ tân',
      bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400',
    },
    MEMBER: {
      label: 'Hội viên',
      bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
  };

  const config = roleConfig[role] || {
    label: role,
    bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export const StatusBadge = ({ isActive }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isActive
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
        }`}
      />
      {isActive ? 'Đang hoạt động' : 'Đã khóa'}
    </span>
  );
};

export default { RoleBadge, StatusBadge };
