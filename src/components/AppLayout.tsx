'use client';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DashboardIcon,
  UsersIcon,
  SunIcon,
  MoonIcon,
  LogOutIcon,
  MenuIcon,
  CloseIcon,
  BriefcaseIcon
} from './Icons';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { admin, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/login');
    }
  }, [admin, loading, router]);

  if (loading) {
    return (
      <div className="loading-state" style={{ minHeight: '100vh' }}>
        <div className="loading-spinner" />
        <span>Initializing Application...</span>
      </div>
    );
  }

  if (!admin) return null;

  const initials = admin.name
    ? admin.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { href: '/applicants', label: 'Applicants', icon: UsersIcon },
  ];

  return (
    <div className="app-layout">
      {/* Mobile Backdrop */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <BriefcaseIcon className="w-5 h-5" />
            </div>
            <div className="brand-text">
              <h1>InternHub</h1>
              <span>Enterprise Admin</span>
            </div>
          </div>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="modal-close"
              aria-label="Close Sidebar"
              style={{ display: 'flex' }}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {/* Theme Switcher Icon Button */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
            style={{ width: '40px', height: '40px', padding: 0, justifyContent: 'center', margin: '0 auto' }}
          >
            {theme === 'dark' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>

          {/* Admin Profile */}
          <div className="admin-info">
            <div className="admin-avatar">{initials}</div>
            <div className="admin-details">
              <div className="admin-name">{admin.name}</div>
              <div className="admin-email">{admin.email}</div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button className="logout-btn" onClick={logout}>
            <LogOutIcon className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Mobile Header Bar */}
        <div className="top-bar-mobile">
          <div className="brand-wrapper">
            <div className="brand-icon" style={{ width: '30px', height: '30px', fontSize: '0.9rem' }}>
              <BriefcaseIcon className="w-4 h-4" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>InternHub</span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="btn btn-secondary btn-sm"
            aria-label="Open Mobile Menu"
            style={{ padding: '6px' }}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
