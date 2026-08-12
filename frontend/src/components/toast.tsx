'use client';

import { X, Zap } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface ToastContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ notifications, onDismiss }: ToastContainerProps) {
  if (!notifications.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {notifications.map((n) => {
        const colors: Record<string, string> = {
          success: 'border-emerald-500/30 bg-emerald-950/90',
          info: 'border-blue-500/30 bg-blue-950/90',
          warning: 'border-yellow-500/30 bg-yellow-950/90',
        };
        const iconColors: Record<string, string> = {
          success: 'text-emerald-400',
          info: 'text-blue-400',
          warning: 'text-yellow-400',
        };

        return (
          <div
            key={n.id}
            className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm animate-slide-up ${colors[n.type] || colors.info}`}
          >
            <Zap size={18} className={iconColors[n.type] || iconColors.info} />
            <p className="text-sm text-white flex-1">{n.message}</p>
            <button onClick={() => onDismiss(n.id)} className="text-slate-400 hover:text-white shrink-0">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
