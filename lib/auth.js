import { q } from './db';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
const key = () => new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
export async function setSession(id) {
  const t = await new SignJWT({ id }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(key());
  cookies().set('session', t, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 604800 });
}
export async function getUser() {
  const t = cookies().get('session')?.value;
  if (!t) return null;
  try { return (await jwtVerify(t, key())).payload.id; } catch { return null; }
}
export async function getMe() {
  const id = await getUser();
  if (!id) return null;
  return (await q('SELECT id,email,role FROM users WHERE id=$1', [id]))[0] || null;
}
