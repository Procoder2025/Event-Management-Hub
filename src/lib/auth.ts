/* ============================================
   Auth Utilities
   Simple cookie-based session management
   ============================================ */

import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';

export interface AdminSession {
  id: number;
  username: string;
}

// Encode session to base64 (simple approach — use JWT in production)
export function createSession(admin: AdminSession): string {
  const payload = JSON.stringify({
    ...admin,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  return Buffer.from(payload).toString('base64');
}

// Decode and validate session
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) return null;
    return { id: payload.id, username: payload.username };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
