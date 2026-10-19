'use client';
import { useRouter } from 'next/navigation';
export default function DeleteButton({ url, after, label = 'Supprimer', confirmText = 'Supprimer définitivement ?' }) {
  const r = useRouter();
  return <button className="link danger" onClick={async () => {
    if (!confirm(confirmText)) return;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) return alert((await res.json()).error);
    if (after) r.push(after); r.refresh();
  }}>{label}</button>;
}
