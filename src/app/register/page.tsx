'use client';

/* ============================================
   Registration Form Page
   Premium form with validation & file upload
   ============================================ */

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Toast from '@/components/Toast';
import { DEPARTMENTS, YEARS, EVENTS } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedEvent = searchParams.get('event') || '';

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    name: '', register_number: '', email: '', phone: '', department: '', year: '', event: preselectedEvent,
  });

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      const maxSize = 2 * 1024 * 1024;
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, id_proof: 'Only JPG, PNG, or PDF files are allowed' }));
      } else if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, id_proof: 'File size must be less than 2MB' }));
      } else {
        setErrors(prev => ({ ...prev, id_proof: '' }));
      }
    } else {
      setFileName('');
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.register_number.trim() || form.register_number.trim().length < 3) newErrors.register_number = 'Register number is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email';
    if (!/^[0-9]{10}$/.test(form.phone)) newErrors.phone = 'Please enter a valid 10-digit number';
    if (!form.department) newErrors.department = 'Please select a department';
    if (!form.year) newErrors.year = 'Please select a year';
    if (!form.event) newErrors.event = 'Please select an event';
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
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      const fileInput = document.getElementById('id_proof') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('id_proof', fileInput.files[0]);
      }

      const res = await fetch('/api/register', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.ok) {
        router.push('/success');
      } else {
        setToast({ message: data.error || 'Registration failed', type: 'danger' });
      }
    } catch {
      setToast({ message: 'Something went wrong. Please try again.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  // Count filled fields for progress
  const totalFields = 7;
  const filledFields = [form.name, form.register_number, form.email, form.phone, form.department, form.year, form.event].filter(Boolean).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <>
      <BackgroundOrbs />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-5">
        <Navbar />

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <Link href="/" className="btn-ghost mb-6 inline-flex text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Events
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">
              Event Registration
            </h1>
            <p className="text-white/35 text-sm">
              Fill in your details to secure your spot
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 animate-fade-in-up-delay-1">
            <div className="flex justify-between text-xs text-white/30 mb-2">
              <span>{filledFields} of {totalFields} fields</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="glass p-8 md:p-10 animate-fade-in-up-delay-2">
            <form onSubmit={handleSubmit} noValidate>

              {/* Section: Personal Info */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                  </svg>
                  Personal Information
                </h3>

                {/* Name */}
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-white/60">
                    Full Name <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.name}
                  </p>}
                </div>

                {/* Register Number */}
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-white/60">
                    Register Number <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text" name="register_number" value={form.register_number} onChange={handleChange}
                    className={`form-input ${errors.register_number ? 'error' : ''}`}
                    placeholder="e.g. 2024CSE001"
                  />
                  {errors.register_number && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.register_number}
                  </p>}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/60">
                      Email <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="you@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      {errors.email}
                    </p>}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/60">
                      Phone <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="tel" name="phone" value={form.phone} onChange={handleChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="10-digit number"
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      {errors.phone}
                    </p>}
                  </div>
                </div>
              </div>

              <hr className="divider-glow" />

              {/* Section: Academic Info */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                  </svg>
                  Academic Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/60">
                      Department <span className="text-violet-400">*</span>
                    </label>
                    <select
                      name="department" value={form.department} onChange={handleChange}
                      className={`form-input ${errors.department ? 'error' : ''}`}
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                    {errors.department && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      {errors.department}
                    </p>}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/60">
                      Year <span className="text-violet-400">*</span>
                    </label>
                    <select
                      name="year" value={form.year} onChange={handleChange}
                      className={`form-input ${errors.year ? 'error' : ''}`}
                    >
                      <option value="">Select Year</option>
                      {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                    </select>
                    {errors.year && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      {errors.year}
                    </p>}
                  </div>
                </div>

                {/* Event */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white/60">
                    Select Event <span className="text-violet-400">*</span>
                  </label>
                  <select
                    name="event" value={form.event} onChange={handleChange}
                    className={`form-input ${errors.event ? 'error' : ''}`}
                  >
                    <option value="">Choose an Event</option>
                    {EVENTS.map(e => <option key={e.value} value={e.value}>{e.value}</option>)}
                  </select>
                  {errors.event && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.event}
                  </p>}
                </div>
              </div>

              <hr className="divider-glow" />

              {/* Section: File Upload */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                  Document Upload
                </h3>

                <label className="block mb-2 text-sm font-medium text-white/60">ID Proof (Optional)</label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 relative group
                    ${dragOver
                      ? 'border-violet-500/60 bg-violet-500/5'
                      : fileName
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-white/10 hover:border-violet-500/30 hover:bg-white/[0.02]'
                    }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const input = document.getElementById('id_proof') as HTMLInputElement;
                    if (e.dataTransfer.files.length > 0 && input) {
                      const dt = new DataTransfer();
                      dt.items.add(e.dataTransfer.files[0]);
                      input.files = dt.files;
                      input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                  }}
                >
                  <input
                    type="file" id="id_proof" accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFile}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  {fileName ? (
                    <div className="animate-slide-up">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-emerald-400 font-medium text-sm">{fileName}</p>
                      <p className="text-white/25 text-xs mt-1">Click or drop to replace</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3 group-hover:bg-violet-500/10 transition-colors">
                        <svg className="w-6 h-6 text-white/50 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <p className="text-white/35 text-sm mb-1">
                        <span className="text-violet-400 font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-white/20 text-xs">JPG, PNG, or PDF (Max 2MB)</p>
                    </>
                  )}
                </div>
                {errors.id_proof && <p className="text-red-400 text-xs mt-1.5">{errors.id_proof}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <>
                    Submit Registration
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          <footer className="text-center py-10 text-white/20 text-sm">
            &copy; 2026 EventHub &middot; College Event Management System
          </footer>
        </div>
      </div>
    </>
  );
}
