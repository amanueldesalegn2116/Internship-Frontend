'use client';
import { useEffect, useState, useCallback } from 'react';
import AppLayout from '../../components/AppLayout';
import { applicantsApi, Applicant, ApplicationStatus, InternshipTrack } from '../../lib/api';
import ApplicantModal from '../../components/ApplicantModal';
import {
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon
} from '../../components/Icons';

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

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await applicantsApi.list({
        page,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(trackFilter && { track: trackFilter }),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setApplicants(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, trackFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchApplicants, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchApplicants, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Soft-delete this applicant? They can be recovered later.')) return;
    try {
      await applicantsApi.delete(id);
      fetchApplicants();
    } catch {
      alert('Failed to delete applicant');
    }
  };

  const openCreate = () => {
    setEditingApplicant(null);
    setModalOpen(true);
  };

  const openEdit = (applicant: Applicant) => {
    setEditingApplicant(applicant);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    fetchApplicants();
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h2 className="page-title">Applicant Roster</h2>
          <p className="page-subtitle">{meta.total} registered applicants found</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <PlusIcon className="w-4 h-4" />
          <span>Add Applicant</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <SearchIcon className="search-icon w-5 h-5" />
          <input
            className="form-input search-input"
            placeholder="Search by candidate name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ minWidth: '170px', width: 'auto' }}
        >
          <option value="">All Application Statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          className="form-select"
          value={trackFilter}
          onChange={(e) => { setTrackFilter(e.target.value); setPage(1); }}
          style={{ minWidth: '210px', width: 'auto' }}
        >
          <option value="">All Internship Tracks</option>
          {TRACKS.map((track) => (
            <option key={track} value={track}>{TRACK_LABELS[track]}</option>
          ))}
        </select>
      </div>

      {/* Applicants Data Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <span>Fetching records...</span>
          </div>
        ) : applicants.length === 0 ? (
          <div className="empty-state">
            <UsersIcon className="empty-state-icon" />
            <p>No matching applicants found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Track</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((a) => {
                const initials = (a.firstName?.[0] || '') + (a.lastName?.[0] || '');
                return (
                  <tr key={a.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '10px',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.85rem', fontWeight: 800, flexShrink: 0
                        }}>
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {a.firstName} {a.lastName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {a.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-track">
                        {TRACK_LABELS[a.track] || a.track}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${a.status.toLowerCase()}`}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      {new Date(a.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(a)}
                          title="Edit Applicant Details"
                        >
                          <EditIcon className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(a.id)}
                          title="Soft Delete Applicant"
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination Footer */}
        {meta.totalPages > 1 && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} candidates
            </span>
            <div className="pagination-controls">
              <button
                className="page-btn"
                disabled={meta.page <= 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Previous Page"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(meta.totalPages, 7) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-btn ${p === meta.page ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next Page"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <ApplicantModal
          applicant={editingApplicant}
          onClose={closeModal}
          onSaved={closeModal}
        />
      )}
    </AppLayout>
  );
}
