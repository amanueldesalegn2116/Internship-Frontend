'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { BriefcaseIcon, AlertTriangleIcon, SunIcon, MoonIcon } from '@/components/Icons';

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('admin@intern.dev');
  const [password, setPassword] = useState('Admin@1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError('Invalid admin credentials. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}>
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
          style={{ width: '40px', height: '40px', padding: 0, justifyContent: 'center', borderRadius: '10px' }}
        >
          {theme === 'dark' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
      </div>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">
            <BriefcaseIcon className="w-7 h-7" />
          </div>
          <h1>InternHub</h1>
          <p>Enterprise Applicant Management System</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-alert">
              <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Admin Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@intern.dev"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Security Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading && <span className="loading-spinner" />}
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
          Seed Account: <code style={{ color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>admin@intern.dev</code> / <code style={{ color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>Admin@1234</code>
        </div>
      </div>
    </div>
  );
}
