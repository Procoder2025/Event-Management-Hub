'use client';

/* ============================================
   Toast Notification Component
   Auto-dismissing alerts with progress bar
   ============================================ */

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'danger' | 'warning';
  onClose?: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-emerald-500/8 border-emerald-500/20',
      text: 'text-emerald-400',
      bar: 'bg-emerald-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    danger: {
      bg: 'bg-red-500/8 border-red-500/20',
      text: 'text-red-400',
      bar: 'bg-red-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-amber-500/8 border-amber-500/20',
      text: 'text-amber-400',
      bar: 'bg-amber-400',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9.5 16.5H2.5L12 3z" />
        </svg>
      ),
    },
  };

  const c = config[type];

  return (
    <div
      className={`
        fixed top-5 right-5 z-[9999] rounded-2xl border overflow-hidden
        backdrop-blur-2xl transition-all duration-300 min-w-[320px] max-w-[420px]
        ${c.bg}
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}
      `}
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <div className={`flex-shrink-0 ${c.text}`}>{c.icon}</div>
        <p className={`text-sm font-medium ${c.text}`}>{message}</p>
      </div>
      <div className="h-[2px] bg-white/5">
        <div
          className={`h-full ${c.bar} opacity-50`}
          style={{ animation: 'shimmer 4s linear forwards', width: visible ? '0%' : '100%', transition: 'width 4s linear' }}
        />
      </div>
    </div>
  );
}
