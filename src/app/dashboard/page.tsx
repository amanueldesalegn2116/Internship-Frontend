'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { dashboardApi, DashboardSummary, ApplicationStatus, InternshipTrack } from '@/lib/api';
import {
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
  BriefcaseIcon
} from '@/components/Icons';

const TRACK_LABELS: Record<InternshipTrack, string> = {
  Frontend_Development: 'Frontend Development',
  Backend_Development: 'Backend Development',
  Mobile_Development: 'Mobile Development',
  UI_UX_Design: 'UI/UX Design',
  Data_Analytics: 'Data Analytics',
};

const STATUS_ICONS: Record<ApplicationStatus, React.ComponentType<{ className?: string }>> = {
  Pending: ClockIcon,
  Shortlisted: FileTextIcon,
  Accepted: CheckCircleIcon,
  Rejected: XCircleIcon,
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.summary()
      .then((res) => setSummary(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="loading-state">
          <div className="loading-spinner" />
          <span>Loading Dashboard Metrics...</span>
        </div>
      </AppLayout>
    );
  }

  if (!summary) {
    return (
      <AppLayout>
        <div className="empty-state">
          <p>Failed to load dashboard statistics.</p>
        </div>
      </AppLayout>
    );
  }

  const statuses: ApplicationStatus[] = ['Pending', 'Shortlisted', 'Accepted', 'Rejected'];
  const tracks: InternshipTrack[] = [
    'Frontend_Development',
    'Backend_Development',
    'Mobile_Development',
    'UI_UX_Design',
    'Data_Analytics',
  ];

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard Overview</h2>
          <p className="page-subtitle">Real-time stats and applicant metrics for your internship program</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stat-grid">
        {/* Total Applicants */}
        <div className="stat-card" style={{ '--accent-bar': 'var(--text-primary)' } as React.CSSProperties}>
          <div className="stat-icon-wrapper">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Applicants</span>
            <span className="stat-value">{summary.totalApplicants}</span>
          </div>
        </div>

        {/* Status Breakdown Cards */}
        {statuses.map((status) => {
          const Icon = STATUS_ICONS[status];
          let colorVar = 'var(--status-pending-fg)';
          let bgVar = 'var(--status-pending-bg)';

          if (status === 'Shortlisted') {
            colorVar = 'var(--status-shortlisted-fg)';
            bgVar = 'var(--status-shortlisted-bg)';
          } else if (status === 'Accepted') {
            colorVar = 'var(--status-accepted-fg)';
            bgVar = 'var(--status-accepted-bg)';
          } else if (status === 'Rejected') {
            colorVar = 'var(--status-rejected-fg)';
            bgVar = 'var(--status-rejected-bg)';
          }

          return (
            <div
              key={status}
              className="stat-card"
              style={{ '--accent-bar': colorVar } as React.CSSProperties}
            >
              <div
                className="stat-icon-wrapper"
                style={{ background: bgVar, color: colorVar, borderColor: 'transparent' }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="stat-content">
                <span className="stat-label">{status}</span>
                <span className="stat-value" style={{ color: colorVar }}>
                  {summary.byStatus[status] || 0}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Recent Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Track Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <BriefcaseIcon className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Applications by Track
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {tracks.map((track) => {
              const count = summary.byTrack[track] || 0;
              const pct = summary.totalApplicants > 0
                ? Math.round((count / summary.totalApplicants) * 100)
                : 0;

              return (
                <div key={track}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {TRACK_LABELS[track]}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {count} <span style={{ color: 'var(--text-dim)', fontWeight: 500, fontSize: '0.75rem' }}>({pct}%)</span>
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '100px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'var(--text-primary)',
                        borderRadius: '100px',
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <ClockIcon className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent Submissions
            </h3>
          </div>
          {summary.recentApplicants.length === 0 ? (
            <div className="empty-state">
              <UsersIcon className="empty-state-icon" />
              <p>No recent submissions found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {summary.recentApplicants.map((a) => {
                const initials = (a.firstName?.[0] || '') + (a.lastName?.[0] || '');
                return (
                  <div
                    key={a.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 800, flexShrink: 0
                    }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {a.firstName} {a.lastName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {a.track ? TRACK_LABELS[a.track as InternshipTrack] || a.track : ''}
                      </div>
                    </div>
                    {a.status && (
                      <span className={`badge badge-${a.status.toLowerCase()}`}>
                        {a.status}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
