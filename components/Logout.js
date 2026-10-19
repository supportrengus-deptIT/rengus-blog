'use client';
import { useRouter } from 'next/navigation';
export default function Logout() {
  const r = useRouter();
  return <button className="link" onClick={async () => { await fetch('/api/auth', { method: 'DELETE' }); r.push('/'); r.refresh(); }}>Déconnexion</button>;
}
