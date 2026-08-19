import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Sparkles,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/applications', label: 'Applications', icon: Users },
  { to: '/admin/jobs', label: 'Job Postings', icon: Briefcase },
];

const SidebarContent = ({ onClose }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-linkedin-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-linkedin-text">HireFlow AI</div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-linkedin-muted">Admin Console</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-linkedin-hover text-linkedin-muted lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-linkedin-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-linkedin-bg">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0A66C2, #4F46E5)' }}>
            {admin?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-linkedin-text truncate">{admin?.email || 'admin@enter.in'}</div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Active Session
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-linkedin-muted px-4 py-2">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-linkedin-border space-y-1">
        <Link
          to="/"
          target="_blank"
          className="sidebar-link text-linkedin-muted"
          onClick={onClose}
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-xs">View Public Portal</span>
        </Link>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-rose-500 hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export const AdminSidebar = ({ mobileOpen, onClose }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 xl:w-64 flex-shrink-0 flex-col border-r border-linkedin-border bg-white sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay + Drawer */}
      {mobileOpen && (
        <>
          <div className="sidebar-overlay lg:hidden" onClick={onClose} />
          <aside className="fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl lg:hidden animate-slide-in">
            <SidebarContent onClose={onClose} />
          </aside>
        </>
      )}
    </>
  );
};
