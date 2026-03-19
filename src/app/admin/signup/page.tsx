'use client';

/* ============================================
   Admin Signup Page
   ============================================ */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Toast from '@/components/Toast';

export default function AdminSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (form.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim())) {
      newErrors.username = 'Only letters, numbers, and underscores allowed';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) {
      setToast({ message: 'Please fix the errors in the form', type: 'danger' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setToast({ message: 'Account created! Redirecting to login...', type: 'success' });
        setTimeout(() => router.push('/admin/login'), 1500);
      } else {
        setToast({ message: data.error || 'Signup failed', type: 'danger' });
      }
    } catch {
      setToast({ message: 'Something went wrong. Please try again.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return { label: '', width: '0%', color: '' };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 2) return { label: 'Weak', width: '33%', color: 'bg-red-500' };
    if (score <= 3) return { label: 'Medium', width: '66%', color: 'bg-amber-500' };
    return { label: 'Strong', width: '100%', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  return (
    <>
      <BackgroundOrbs />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-5">
        <Navbar />

        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="glass max-w-md w-full p-10 animate-fade-in-up relative overflow-hidden">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-center mb-1.5 gradient-text">Create Admin Account</h2>
            <p className="text-center text-white/35 text-sm mb-8">
              Sign up to manage events and registrations
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-white/50">Username</label>
                <div className="flex items-center gap-3 form-input" style={{ paddingLeft: 14, paddingRight: 14 }}>
                  <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                  </svg>
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setErrors(e2 => ({ ...e2, username: '' })); }}
                    className={`bg-transparent border-none outline-none w-full text-white placeholder-white/30 ${errors.username ? 'text-red-300' : ''}`}
                    placeholder="Choose a username"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-white/50">Email</label>
                <div className="flex items-center gap-3 form-input" style={{ paddingLeft: 14, paddingRight: 14 }}>
                  <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(e2 => ({ ...e2, email: '' })); }}
                    className="bg-transparent border-none outline-none w-full text-white placeholder-white/30"
                    placeholder="admin@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-white/50">Password</label>
                <div className="flex items-center gap-3 form-input" style={{ paddingLeft: 14, paddingRight: 14 }}>
                  <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(e2 => ({ ...e2, password: '' })); }}
                    className="bg-transparent border-none outline-none w-full text-white placeholder-white/30"
                    placeholder="Min. 6 characters"
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
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.password}
                  </p>
                )}
                {form.password && (
                  <div className="mt-2">
                    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${
                      strength.label === 'Weak' ? 'text-red-400' :
                      strength.label === 'Medium' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      {strength.label} password
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-8">
                <label className="block mb-2 text-sm font-medium text-white/50">Confirm Password</label>
                <div className="flex items-center gap-3 form-input" style={{ paddingLeft: 14, paddingRight: 14 }}>
                  <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => { setForm(f => ({ ...f, confirmPassword: e.target.value })); setErrors(e2 => ({ ...e2, confirmPassword: '' })); }}
                    className="bg-transparent border-none outline-none w-full text-white placeholder-white/30"
                    placeholder="Re-enter your password"
                  />
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <>
                    Create Account
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/[0.05] text-center">
              <p className="text-sm text-white/30">
                Already have an account?{' '}
                <Link href="/admin/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
