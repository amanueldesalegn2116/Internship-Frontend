'use client';
import { useState } from 'react';
import { applicantsApi, Applicant, ApplicationStatus, InternshipTrack } from '../lib/api';
import { CloseIcon, AlertTriangleIcon, CheckCircleIcon, FileTextIcon, UserIcon } from './Icons';

const STATUSES: ApplicationStatus[] = ['Pending', 'Shortlisted', 'Accepted', 'Rejected'];
const TRACKS: InternshipTrack[] = [
  'Frontend_Development',
  'Backend_Development',
  'Mobile_Development',
  'UI_UX_Design',
  'Data_Analytics'
];

const TRACK_LABELS: Record<InternshipTrack, string> = {
  Frontend_Development: 'Frontend Development',
  Backend_Development: 'Backend Development',
  Mobile_Development: 'Mobile Development',
  UI_UX_Design: 'UI/UX Design',
  Data_Analytics: 'Data Analytics',
};

interface Props {
  applicant: Applicant | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ApplicantModal({ applicant, onClose, onSaved }: Props) {
  const isEdit = Boolean(applicant);
  const [activeTab, setActiveTab] = useState<'details' | 'status' | 'notes'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: applicant?.firstName ?? '',
    lastName: applicant?.lastName ?? '',
    email: applicant?.email ?? '',
    phone: applicant?.phone ?? '',
    track: applicant?.track ?? ('Frontend_Development' as InternshipTrack),
    status: applicant?.status ?? ('Pending' as ApplicationStatus),
    resumeUrl: applicant?.resumeUrl ?? '',
    coverLetter: applicant?.coverLetter ?? '',
    notes: applicant?.notes ?? '',
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setError('');
    setLoading(true);
    try {
      if (isEdit && applicant) {
        await applicantsApi.update(applicant.id, form);
      } else {
        await applicantsApi.create(form);
      }
      onSaved();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(typeof msg === 'string' ? msg : 'Failed to save applicant');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!applicant) return;
    setError('');
    setLoading(true);
    try {
      await applicantsApi.updateStatus(applicant.id, form.status);
      onSaved();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(typeof msg === 'string' ? msg : 'Invalid status transition');
    } finally {
      setLoading(false);
    }
  };

  const handleNotesUpdate = async () => {
    if (!applicant) return;
    setError('');
    setLoading(true);
    try {
      await applicantsApi.updateNotes(applicant.id, form.notes);
      onSaved();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(typeof msg === 'string' ? msg : 'Failed to save internal notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{isEdit ? 'Edit Applicant Profile' : 'New Internship Applicant'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close Modal">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation for Editing Mode */}
        {isEdit && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 28px' }}>
            {[
              { id: 'details', label: 'Profile Details', icon: UserIcon },
              { id: 'status', label: 'Application Status', icon: CheckCircleIcon },
              { id: 'notes', label: 'Internal Notes', icon: FileTextIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'details' | 'status' | 'notes')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    borderBottom: isActive ? '2px solid var(--text-primary)' : '2px solid transparent',
                    marginBottom: '-1px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <div className="error-alert" style={{ margin: '20px 28px 0' }}>
            <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Details Tab */}
        {(!isEdit || activeTab === 'details') && (
          <>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    className="form-input"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    placeholder="e.g. Jane"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    className="form-input"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    placeholder="e.g. Doe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  className="form-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="jane.doe@example.com"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+1-555-0100"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Internship Track *</label>
                  <select
                    className="form-select"
                    value={form.track}
                    onChange={(e) => update('track', e.target.value)}
                  >
                    {TRACKS.map((t) => (
                      <option key={t} value={t}>{TRACK_LABELS[t]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Resume / CV URL</label>
                <input
                  className="form-input"
                  type="url"
                  value={form.resumeUrl}
                  onChange={(e) => update('resumeUrl', e.target.value)}
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter</label>
                <textarea
                  className="form-textarea"
                  value={form.coverLetter}
                  onChange={(e) => update('coverLetter', e.target.value)}
                  placeholder="Candidate cover letter summary..."
                  rows={4}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading && <span className="loading-spinner" />}
                <span>{isEdit ? 'Save Changes' : 'Create Candidate'}</span>
              </button>
            </div>
          </>
        )}

        {/* Status Tab */}
        {isEdit && activeTab === 'status' && (
          <>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Update Application Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => update('status', e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  padding: '16px',
                  background: 'var(--status-pending-bg)',
                  border: '1px solid var(--status-pending-border)',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  color: 'var(--status-pending-fg)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" style={{ marginTop: '2px' }} />
                <div>
                  <strong>Business Rule Enforcement:</strong>
                  <div style={{ marginTop: '4px', opacity: 0.9 }}>
                    Applicants cannot transition directly from <strong>Rejected</strong> to <strong>Accepted</strong>.
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleStatusUpdate} disabled={loading}>
                {loading && <span className="loading-spinner" />}
                <span>Update Status</span>
              </button>
            </div>
          </>
        )}

        {/* Notes Tab */}
        {isEdit && activeTab === 'notes' && (
          <>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Internal Admin Notes (Max 1,000 characters)</label>
                <textarea
                  className="form-textarea"
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Confidential interviewer evaluation notes..."
                  rows={6}
                  maxLength={1000}
                />
                <div style={{
                  fontSize: '0.75rem',
                  color: form.notes.length > 900 ? 'var(--status-rejected-fg)' : 'var(--text-muted)',
                  textAlign: 'right',
                  fontWeight: 600,
                  marginTop: '4px',
                }}>
                  {form.notes.length}/1000 characters
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleNotesUpdate} disabled={loading}>
                {loading && <span className="loading-spinner" />}
                <span>Save Notes</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
