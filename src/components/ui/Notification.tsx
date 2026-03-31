"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotificationProps {
  notification: { message: string; type: string } | null;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!notification) {
      setVisible(false);
      return;
    }
    setVisible(true);
    setProgress(100);

    const duration = 4000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((p) => Math.max(0, p - step));
    }, interval);

    return () => clearInterval(timer);
  }, [notification]);

  if (!notification) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col gap-0 rounded-xl shadow-2xl border overflow-hidden w-80 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${
        isSuccess
          ? 'bg-slate-900 border-cyan-500/30'
          : 'bg-slate-900 border-red-500/30'
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <div className="mt-0.5 shrink-0">
          {isSuccess
            ? <CheckCircle size={17} className="text-cyan-400" />
            : <XCircle size={17} className="text-red-400" />
          }
        </div>
        <p className="text-sm text-slate-200 flex-1 leading-snug">{notification.message}</p>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors mt-0.5"
        >
          <X size={14} />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-px w-full bg-slate-700/50">
        <div
          className={`h-full transition-all duration-50 ${isSuccess ? 'bg-cyan-400' : 'bg-red-400'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Notification;
