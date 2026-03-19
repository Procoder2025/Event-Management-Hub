'use client';

/* ============================================
   Navbar Component
   Refined glassmorphism navigation
   ============================================ */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  isAdmin?: boolean;
}

export default function Navbar({ isAdmin = false }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = isAdmin
    ? [
        { href: '/', label: 'View Site' },
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/api/auth/logout', label: 'Logout', danger: true },
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/#events', label: 'Events' },
        { href: '/register', label: 'Register' },
        { href: '/admin/login', label: 'Admin' },
      ];

  return (
    <nav className="glass sticky top-4 z-50 flex items-center justify-between px-6 py-3.5 mb-10 border-white/[0.06]">
      {/* Logo */}
      <Link
        href={isAdmin ? '/admin/dashboard' : '/'}
        className="flex items-center gap-2.5 text-xl font-bold no-underline"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-black shadow-lg shadow-violet-500/25">
          E
        </div>
        <span className="gradient-text-accent">
          EventHub{isAdmin && ' Admin'}
        </span>
      </Link>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-white/70 text-xl bg-transparent border-none cursor-pointer hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Nav links */}
      <ul className={`
        flex list-none gap-1 items-center
        max-md:fixed max-md:top-0 max-md:right-0 max-md:w-72 max-md:h-screen
        max-md:bg-[rgba(5,5,16,0.97)] max-md:backdrop-blur-2xl
        max-md:flex-col max-md:pt-20 max-md:px-6 max-md:z-[999]
        max-md:transition-transform max-md:duration-300 max-md:border-l max-md:border-white/[0.06]
        ${isOpen ? 'max-md:translate-x-0' : 'max-md:translate-x-full'}
      `}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          const isDanger = 'danger' in link && link.danger;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 block
                  ${isDanger
                    ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                    : isActive
                      ? 'text-white bg-white/[0.08] shadow-sm'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                  }
                `}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
        {!isAdmin && (
          <li className="max-md:mt-2 ml-1">
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="hidden md:inline-flex btn-primary !py-2 !px-5 !text-sm !rounded-xl !shadow-none"
            >
              Register Now
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
