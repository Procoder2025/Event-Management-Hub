'use client';

/* ============================================
   Admin Dashboard Page
   Table view with search, filter, edit, delete
   ============================================ */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import Toast from '@/components/Toast';
import { DEPARTMENTS, YEARS, EVENTS } from '@/lib/constants';

interface Registration {
  id: number;
  name: string;
  register_number: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  event: string;
  id_proof: string | null;
  registered_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');

  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<Registration | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/registrations');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setRegistrations(data.data || []);
    } catch {
      setToast({ message: 'Failed to load data', type: 'danger' });
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Filter logic
  const filtered = registrations.filter(r => {
    const matchSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.register_number.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search);
    const matchDept = !deptFilter || r.department === deptFilter;
    const matchEvent = !eventFilter || r.event === eventFilter;
    return matchSearch && matchDept && matchEvent;
  });

  // Stats
  const total = registrations.length;
  const todayCount = registrations.filter(r =>
    new Date(r.registered_at).toDateString() === new Date().toDateString()
  ).length;
  const deptCount = new Set(registrations.map(r => r.department)).size;
  const eventCount = new Set(registrations.map(r => r.event)).size;

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/registrations?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToast({ message: 'Record deleted successfully', type: 'success' });
        fetchData();
      } else {
        setToast({ message: 'Failed to delete record', type: 'danger' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'danger' });
    }
  }

  async function handleEdit() {
    if (!editData) return;
    try {
      const res = await fetch('/api/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: 'Record updated successfully', type: 'success' });
        setEditModal(false);
        fetchData();
      } else {
        setToast({ message: data.error || 'Failed to update', type: 'danger' });
      }
    } catch {
      setToast({ message: 'Something went wrong', type: 'danger' });
    }
  }

  function handleExport() {
    window.location.href = '/api/registrations/export';
  }

  const statCards = [
    {
      label: 'Total Registrations',
      value: total,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      color: 'from-violet-500 to-indigo-500',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-400',
    },
    {
      label: "Today's Registrations",
      value: todayCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Departments',
      value: deptCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
    },
    {
      label: 'Active Events',
      value: eventCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400',
    },
  ];

  return (
    <>
      <BackgroundOrbs />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-5">
        <Navbar isAdmin />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h2 className="text-3xl font-bold gradient-text">Dashboard</h2>
            <p className="text-white/30 text-sm mt-1">Manage event registrations</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleExport} className="btn-ghost">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export CSV
            </button>
            <button onClick={() => fetchData()} className="btn-ghost">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up-delay-1">
          {statCards.map(stat => (
            <div key={stat.label} className="glass p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.textColor} flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-white/30 text-xs mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="glass p-4 flex flex-col md:flex-row gap-3 mb-6 animate-fade-in-up-delay-2">
          <div className="flex items-center gap-3 flex-1 form-input !bg-transparent !border-transparent focus-within:!border-violet-500/30" style={{ paddingLeft: 14, paddingRight: 14 }}>
            <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text" placeholder="Search by name, register no, email, phone..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-white placeholder-white/30"
            />
          </div>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="form-input md:w-48 !bg-transparent !border-white/[0.06]">
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.value}</option>)}
          </select>
          <select value={eventFilter} onChange={e => setEventFilter(e.target.value)} className="form-input md:w-52 !bg-transparent !border-white/[0.06]">
            <option value="">All Events</option>
            {EVENTS.map(e => <option key={e.value} value={e.value}>{e.value}</option>)}
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-3 px-1 animate-fade-in-up-delay-3">
          <p className="text-white/25 text-sm">
            Showing <span className="text-white/50 font-medium">{filtered.length}</span> of {total} registrations
          </p>
        </div>

        {/* Table */}
        <div className="glass overflow-x-auto animate-fade-in-up-delay-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="w-8 h-8 animate-spin text-violet-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-white/30 text-sm">Loading registrations...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-white/30 text-sm">{registrations.length === 0 ? 'No registrations yet.' : 'No matching records found.'}</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Reg. No</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Event</th>
                  <th>ID Proof</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg, i) => (
                  <tr key={reg.id}>
                    <td className="text-white/30">{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center text-xs font-bold text-violet-300 flex-shrink-0">
                          {reg.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-white/90">{reg.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/10">
                        {reg.register_number}
                      </span>
                    </td>
                    <td className="text-white/50">{reg.email}</td>
                    <td className="text-white/50">{reg.phone}</td>
                    <td>
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/10">
                        {reg.department}
                      </span>
                    </td>
                    <td className="text-white/50">{reg.year}</td>
                    <td>
                      <span className="text-sm text-white/60">{reg.event}</span>
                    </td>
                    <td>
                      {reg.id_proof ? (
                        <a href={reg.id_proof} target="_blank" rel="noreferrer" className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1 transition-colors">
                          View
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-white/15">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap text-white/40 text-sm">
                      {new Date(reg.registered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => { setEditData({ ...reg }); setEditModal(true); }}
                          className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-emerald-500/15 flex items-center justify-center text-white/60 hover:text-emerald-400 transition-all cursor-pointer border border-transparent hover:border-emerald-500/20"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(reg.id)}
                          className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-red-500/15 flex items-center justify-center text-white/60 hover:text-red-400 transition-all cursor-pointer border border-transparent hover:border-red-500/20"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <footer className="text-center py-10 text-white/20 text-sm mt-8 border-t border-white/[0.04]">
          &copy; 2026 EventHub Admin
        </footer>
      </div>

      {/* Edit Modal */}
      {editModal && editData && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setEditModal(false); }}
        >
          <div className="glass w-full max-w-lg max-h-[85vh] overflow-y-auto p-8 animate-fade-in-up relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold gradient-text">Edit Registration</h3>
              <button
                onClick={() => setEditModal(false)}
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/70 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-white/50">Full Name</label>
                  <input
                    type="text" value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-white/50">Register Number</label>
                  <input
                    type="text" value={editData.register_number}
                    onChange={e => setEditData({ ...editData, register_number: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-white/50">Email</label>
                  <input
                    type="email" value={editData.email}
                    onChange={e => setEditData({ ...editData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-white/50">Phone</label>
                  <input
                    type="tel" value={editData.phone}
                    onChange={e => setEditData({ ...editData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-white/50">Department</label>
                  <select
                    value={editData.department}
                    onChange={e => setEditData({ ...editData, department: e.target.value })}
                    className="form-input"
                  >
                    {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.value}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-white/50">Year</label>
                  <select
                    value={editData.year}
                    onChange={e => setEditData({ ...editData, year: parseInt(e.target.value) })}
                    className="form-input"
                  >
                    {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-white/50">Event</label>
                <select
                  value={editData.event}
                  onChange={e => setEditData({ ...editData, event: e.target.value })}
                  className="form-input"
                >
                  {EVENTS.map(e => <option key={e.value} value={e.value}>{e.value}</option>)}
                </select>
              </div>
            </div>

            <hr className="divider-glow" />

            <div className="flex justify-end gap-3">
              <button onClick={() => setEditModal(false)} className="btn-secondary text-sm py-2.5 px-5">Cancel</button>
              <button onClick={handleEdit} className="btn-primary text-sm py-2.5 px-5">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
