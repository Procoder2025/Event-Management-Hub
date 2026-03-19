'use client';

/* ============================================
   Admin Login Page
   ============================================ */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Toast from '@/components/Toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setToast({ message: 'Please enter both username and password', type: 'danger' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setToast({ message: data.error || 'Invalid credentials', type: 'danger' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackgroundOrbs />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-5">
        <Navbar />

        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="glass max-w-md w-full p-10 animate-fade-in-up relative overflow-hidden">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-500/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-center mb-1.5 gradient-text">Admin Login</h2>
            <p className="text-center text-white/35 text-sm mb-8">
              Enter your credentials to access the dashboard
            </p>

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-white/50">Username</label>
                <div className="flex items-center gap-3 form-input" style={{ paddingLeft: 14, paddingRight: 14 }}>
                  <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                  </svg>
                  <input
                    type="text" value={username} onChange={e => setUsername(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-white placeholder-white/30"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-8">
                <label className="block mb-2 text-sm font-medium text-white/50">Password</label>
                <div className="flex items-center gap-3 form-input" style={{ paddingLeft: 14, paddingRight: 14 }}>
                  <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-white placeholder-white/30"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/50 hover:text-white/80 cursor-pointer bg-transparent border-none transition-colors flex-shrink-0"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/[0.05] text-center">
              <p className="text-sm text-white/30">
                Don&apos;t have an account?{' '}
                <Link href="/admin/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
              <Link href="/" className="inline-block mt-3 text-xs text-white/25 hover:text-white/40 transition-colors">
                &larr; Back to site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
