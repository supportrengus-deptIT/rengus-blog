import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { q } from '../../../lib/db';
import { setSession } from '../../../lib/auth';
const err = (error, status) => Response.json({ error }, { status });
export async function POST(req) {
  const { mode, email, password } = await req.json();
  const e = String(email || '').trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(e) || String(password || '').length < 6)
    return err('Adresse e-mail invalide ou mot de passe trop court (6 caractères minimum).', 400);
  let u;
  if (mode === 'register') {
    if ((await q('SELECT 1 FROM users WHERE email=$1', [e])).length) return err('Un compte existe déjà avec cette adresse.', 409);
    const first = !(await q('SELECT 1 FROM users LIMIT 1')).length;
      u = (await q('INSERT INTO users(email,password,role) VALUES($1,$2,$3) RETURNING id', [e, await bcrypt.hash(password, 10), first ? 'admin' : 'user']))[0];
  } else {
    u = (await q('SELECT id,password FROM users WHERE email=$1', [e]))[0];
    if (!u || !(await bcrypt.compare(password, u.password))) return err('Adresse e-mail ou mot de passe incorrect.', 401);
  }
  await setSession(u.id);
  return Response.json({ ok: true });
}
export async function DELETE() { cookies().delete('session'); return Response.json({ ok: true }); }
