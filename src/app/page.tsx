/* ============================================
   Home Page
   Hero + Stats + Event Cards + Footer
   ============================================ */

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import CountdownTimer from '@/components/CountdownTimer';
import { EVENTS } from '@/lib/constants';

const EVENT_COLORS = [
  { bg: 'bg-gradient-to-br from-violet-500 to-indigo-600', shadow: 'shadow-violet-500/25' },
  { bg: 'bg-gradient-to-br from-pink-500 to-rose-600', shadow: 'shadow-pink-500/25' },
  { bg: 'bg-gradient-to-br from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/25' },
  { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', shadow: 'shadow-amber-500/25' },
  { bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/25' },
  { bg: 'bg-gradient-to-br from-fuchsia-500 to-purple-600', shadow: 'shadow-fuchsia-500/25' },
];

const STATS = [
  { number: '6+', label: 'Events', icon: '🎯' },
  { number: '500+', label: 'Registrations', icon: '👥' },
  { number: '9', label: 'Departments', icon: '🏛️' },
  { number: '4', label: 'Years', icon: '📅' },
];

export default function Home() {
  return (
    <>
      <BackgroundOrbs />
      <div className="relative z-10 max-w-7xl mx-auto px-5 py-5">
        <Navbar />

        {/* ===== Hero Section ===== */}
        <section className="text-center pt-16 pb-24 animate-fade-in-up">
          <div className="badge badge-glow mb-6 animate-pulse-glow">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Registrations Open — Academic Year 2025-26
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            <span className="gradient-text">Discover & Register</span>
            <br />
            <span className="text-white/90">for Campus Events</span>
          </h1>

          <p className="text-lg text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
            From hackathons to cultural nights — explore all upcoming events,
            secure your spot, and never miss out on the action.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="btn-primary text-base">
              Register Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a href="#events" className="btn-secondary text-base">
              Explore Events
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </section>

        {/* ===== Stats Strip ===== */}
        <section className="glass grid grid-cols-2 md:grid-cols-4 mb-20 animate-fade-in-up-delay-1 divide-x divide-white/[0.06]">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="stat-number gradient-text-accent">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* ===== Events Section ===== */}
        <section id="events" className="mb-20 scroll-mt-24">
          <div className="text-center mb-12">
            <span className="badge badge-glow mb-4 inline-flex">Upcoming Events</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 animate-fade-in-up">
              What&apos;s Happening
            </h2>
            <p className="text-white/35 max-w-lg mx-auto animate-fade-in-up-delay-1">
              Choose an event, register in seconds, and get ready for an unforgettable experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {EVENTS.map((event, i) => {
              const color = EVENT_COLORS[i % EVENT_COLORS.length];
              return (
                <div
                  key={event.value}
                  className={`glass-card p-7 animate-fade-in-up-delay-${Math.min((i % 3) + 1, 5)}`}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Icon */}
                  <div className={`event-icon ${color.bg} shadow-lg ${color.shadow} mb-5`}>
                    {event.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold mb-2 text-white/95">{event.value}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-4">{event.description}</p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 text-xs text-white/60 mb-1">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {event.venue}
                    </span>
                  </div>

                  {/* Countdown */}
                  <CountdownTimer targetDate={event.date} />

                  {/* Register link */}
                  <div className="mt-5 pt-4 border-t border-white/[0.05]">
                    <Link
                      href={`/register?event=${encodeURIComponent(event.value)}`}
                      className="btn-ghost w-full justify-center text-sm"
                    >
                      Register
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== CTA Section ===== */}
        <section className="glass text-center p-12 md:p-16 mb-16 animate-fade-in-up relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-pink-600/10 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Ready to Join?
            </h2>
            <p className="text-white/40 max-w-lg mx-auto mb-8">
              Don&apos;t miss out on the biggest events of the semester. Register now and be part of the excitement.
            </p>
            <Link href="/register" className="btn-primary text-base">
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ===== Footer ===== */}
        <footer className="text-center py-10 border-t border-white/[0.04]">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-black">
              E
            </div>
            <span className="font-bold text-white/60">EventHub</span>
          </div>
          <p className="text-white/25 text-sm">
            &copy; 2026 EventHub &middot; College Event Management System
          </p>
        </footer>
      </div>
    </>
  );
}
