/* ============================================
   CSV Export API
   GET /api/registrations/export
   Returns all registrations as a CSV file
   ============================================ */

import { NextResponse } from 'next/server';
import getSupabase from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const { data: rows, error } = await supabase
      .from('registrations')
      .select('id, name, register_number, email, phone, department, year, event, registered_at')
      .order('registered_at', { ascending: false });

    if (error) throw error;

    // Build CSV
    const headers = ['ID', 'Name', 'Register Number', 'Email', 'Phone', 'Department', 'Year', 'Event', 'Registered At'];
    const csvRows = [headers.join(',')];

    for (const row of rows || []) {
      csvRows.push([
        row.id,
        `"${(row.name || '').replace(/"/g, '""')}"`,
        `"${row.register_number || ''}"`,
        `"${row.email}"`,
        `"${row.phone}"`,
        `"${row.department}"`,
        row.year,
        `"${(row.event || '').replace(/"/g, '""')}"`,
        `"${row.registered_at}"`,
      ].join(','));
    }

    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="registrations_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export.' }, { status: 500 });
  }
}
