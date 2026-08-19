import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, Menu } from 'lucide-react';

export const AdminHeader = ({ title, subtitle, action, onMenuClick }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header
      className="h-14 bg-white border-b border-linkedin-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 flex-shrink-0"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}
    >
      {/* Left — Hamburger (mobile) + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-linkedin-hover text-linkedin-muted flex-shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-linkedin-text truncate leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-linkedin-muted truncate hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right — Action + User */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {action && <div className="hidden sm:block">{action}</div>}

        {/* Notifications placeholder */}
        <button className="relative p-2 rounded-lg hover:bg-linkedin-hover text-linkedin-muted transition-colors hidden sm:flex items-center justify-center">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-linkedin-border">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}>
            {admin?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-linkedin-text leading-tight truncate max-w-[140px]">
              {admin?.email || 'admin@enter.in'}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">Admin</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg hover:bg-rose-50 text-linkedin-muted hover:text-rose-500 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
