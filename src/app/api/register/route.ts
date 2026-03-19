/* ============================================
   Registration API Route
   POST /api/register
   Validates input, handles file upload, stores data
   ============================================ */

import { NextRequest, NextResponse } from 'next/server';
import getSupabase from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const formData = await request.formData();

    // Extract fields
    const name = (formData.get('name') as string)?.trim() || '';
    const email = (formData.get('email') as string)?.trim() || '';
    const phone = (formData.get('phone') as string)?.trim() || '';
    const department = (formData.get('department') as string)?.trim() || '';
    const year = parseInt(formData.get('year') as string) || 0;
    const event = (formData.get('event') as string)?.trim() || '';
    const register_number = (formData.get('register_number') as string)?.trim() || '';

    // --- Validation ---
    const errors: string[] = [];

    if (name.length < 2) errors.push('Name must be at least 2 characters.');
    if (!register_number || register_number.length < 3) errors.push('Register number is required (min 3 characters).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email address.');
    if (!/^[0-9]{10}$/.test(phone)) errors.push('Phone must be a 10-digit number.');

    const validDepts = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'MBA', 'OTHER'];
    if (!validDepts.includes(department)) errors.push('Invalid department.');

    if (year < 1 || year > 4) errors.push('Invalid year.');

    const validEvents = ['TechFest 2026', 'Cultural Night', 'Sports Meet', 'Workshop Series', 'Guest Lecture', 'Quiz Competition'];
    if (!validEvents.includes(event)) errors.push('Invalid event.');

    // Check duplicate email
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (existing && existing.length > 0) errors.push('This email is already registered.');

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    }

    // --- File Upload to Supabase Storage ---
    let idProofPath: string | null = null;
    const file = formData.get('id_proof') as File | null;

    if (file && file.size > 0) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Only JPG, PNG, or PDF files allowed.' }, { status: 400 });
      }
      if (file.size > maxSize) {
        return NextResponse.json({ error: 'File must be under 2MB.' }, { status: 400 });
      }

      // Upload to Supabase Storage bucket "id-proofs"
      const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
      const uniqueName = `id_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('id-proofs')
        .upload(uniqueName, file, { contentType: file.type });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('id-proofs')
        .getPublicUrl(uniqueName);

      idProofPath = urlData.publicUrl;
    }

    // --- Insert into Database ---
    const { error: insertError } = await supabase
      .from('registrations')
      .insert([{ name, register_number, email, phone, department, year, event, id_proof: idProofPath }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Registration failed. ' + insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Registration successful!' }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
