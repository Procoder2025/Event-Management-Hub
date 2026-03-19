/* ============================================
   Admin Login API Route
   POST /api/auth/login
   Verifies credentials, sets session cookie
   ============================================ */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getSupabase from '@/lib/db';
import { createSession, SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required.' }, { status: 400 });
    }

    // Look up admin user
    const { data: rows, error } = await supabase
      .from('admin_users')
      .select('id, username, password')
      .eq('username', username)
      .limit(1);

    if (error || !rows || rows.length === 0) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const admin = rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    // Create session token
    const token = createSession({ id: admin.id, username: admin.username });

    // Set cookie
    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
