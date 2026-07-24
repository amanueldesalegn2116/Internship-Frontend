'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { admin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.push(admin ? '/dashboard' : '/login');
    }
  }, [admin, loading, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loading-spinner" style={{ borderTopColor: 'var(--accent-blue)', borderColor: 'rgba(79,124,255,0.2)', width: '32px', height: '32px', borderWidth: '3px' }} />
    </div>
  );
}
