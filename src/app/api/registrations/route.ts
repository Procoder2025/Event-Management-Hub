/* ============================================
   Registrations CRUD API
   GET    /api/registrations         — fetch all
   DELETE /api/registrations?id=X    — delete by ID
   PUT    /api/registrations         — update record
   ============================================ */

import { NextRequest, NextResponse } from 'next/server';
import getSupabase from '@/lib/db';
import { getSession } from '@/lib/auth';

// Auth guard helper
async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// GET: Fetch all registrations
export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('registered_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations.' }, { status: 500 });
  }
}

// DELETE: Remove a registration
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    // Get file path before deleting to remove from storage
    const { data: rows } = await supabase
      .from('registrations')
      .select('id_proof')
      .eq('id', id)
      .limit(1);

    if (rows && rows.length > 0 && rows[0].id_proof) {
      const url = rows[0].id_proof as string;
      const fileName = url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('id-proofs').remove([fileName]);
      }
    }

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Record deleted.' });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete.' }, { status: 500 });
  }
}

// PUT: Update a registration
export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { id, name, email, phone, department, year, event } = body;

    if (!id || !name || !email || !phone || !department || !year || !event) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Check email uniqueness (excluding current record)
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', email)
      .neq('id', id)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Email already exists for another registration.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('registrations')
      .update({ name, email, phone, department, year: parseInt(year), event })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Record updated.' });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update.' }, { status: 500 });
  }
}
