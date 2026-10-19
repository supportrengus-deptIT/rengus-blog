'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Connexion() {
  const r = useRouter();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setError('');
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, email, password }) });
    const d = await res.json();
    if (!res.ok) return setError(d.error);
    r.push('/nouveau'); r.refresh();
  }
  const reg = mode === 'register';
  return (
    <form onSubmit={submit} className="form narrow">
      <h1>{reg ? 'Créer un compte' : 'Connexion'}</h1>
      <p className="muted">Connectez-vous pour publier un article.</p>
      <label>Adresse e-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Mot de passe<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn">{reg ? 'Créer mon compte' : 'Se connecter'}</button>
      <button type="button" className="link" onClick={() => setMode(reg ? 'login' : 'register')}>
        {reg ? 'J’ai déjà un compte' : 'Créer un compte'}
      </button>
    </form>
  );
}
