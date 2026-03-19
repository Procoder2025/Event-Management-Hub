/* ============================================
   Admin Logout Route
   GET /api/auth/logout
   Clears session cookie and redirects
   ============================================ */

import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';

export async function GET() {
  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
