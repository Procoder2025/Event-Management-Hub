'use client';

/* ============================================
   Success Page
   Celebratory page after registration
   ============================================ */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import BackgroundOrbs from '@/components/BackgroundOrbs';

const CONFETTI_COLORS = ['#7c3aed', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

function ConfettiPiece({ index }: { index: number }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const left = `${Math.random() * 100}%`;
  const delay = `${Math.random() * 2}s`;
  const duration = `${2 + Math.random() * 3}s`;
  const size = 6 + Math.random() * 8;
  const rotation = Math.random() * 360;

  return (
    <div
      className="confetti-piece"
      style={{
        left,
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        animationDelay: delay,
        animationDuration: duration,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
}

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <BackgroundOrbs />

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-5">
        <Navbar />

        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="glass max-w-lg w-full p-12 text-center animate-fade-in-up relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
              {/* Success icon */}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/25 animate-bounce-in">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold mb-3 gradient-text">
                Registration Successful!
              </h2>

              <p className="text-white/40 mb-4 leading-relaxed">
                Thank you for registering. You&apos;re all set!
              </p>

              <div className="glass p-4 rounded-xl mb-8 border-emerald-500/10">
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <span>A confirmation email will be sent to you shortly.</span>
                </div>
              </div>

              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/" className="btn-primary">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  Back to Home
                </Link>
                <Link href="/register" className="btn-secondary">
                  Register Another
                </Link>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center py-10 text-white/20 text-sm">
          &copy; 2026 EventHub &middot; College Event Management System
        </footer>
      </div>
    </>
  );
}
