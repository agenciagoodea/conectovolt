'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './sidebar';
import { useSocketNotifications } from '@/lib/socket';
import ToastContainer from '@/components/toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { notifications, dismiss } = useSocketNotifications();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    } else if (user.role === 'CUSTOMER') {
      router.push('/portal');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400" />
      </div>
    );
  }

  if (!user || user.role === 'CUSTOMER') return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <main className="lg:pl-64 p-6">
        {children}
      </main>
      <ToastContainer notifications={notifications} onDismiss={dismiss} />
    </div>
  );
}
