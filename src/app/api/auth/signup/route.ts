/* ============================================
   Admin Signup API Route
   POST /api/auth/signup
   Creates a new admin account
   ============================================ */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getSupabase from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { username, email, password } = await request.json();

    // --- Validation ---
    const errors: string[] = [];

    if (!username || username.trim().length < 3) {
      errors.push('Username must be at least 3 characters.');
    }
    if (username && !/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      errors.push('Username can only contain letters, numbers, and underscores.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters.');
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    const trimmedUsername = username.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', trimmedUsername)
      .limit(1);

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ error: 'Username is already taken.' }, { status: 409 });
    }

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', trimmedEmail)
      .limit(1);

    if (existingEmail && existingEmail.length > 0) {
      return NextResponse.json({ error: 'Email is already registered.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert([{
        username: trimmedUsername,
        email: trimmedEmail,
        password: hashedPassword,
      }]);

    if (insertError) {
      console.error('Signup insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create account. ' + insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Account created successfully!' }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
