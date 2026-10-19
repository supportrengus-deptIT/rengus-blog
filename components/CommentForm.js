'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function CommentForm({ articleId }) {
  const r = useRouter();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setError('');
    const res = await fetch(`/api/articles/${articleId}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: text }) });
    if (!res.ok) return setError((await res.json()).error);
    setText(''); r.refresh();
  }
  return (
    <form onSubmit={submit} className="form">
      <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Votre commentaire" required />
      {error && <p className="error">{error}</p>}
      <div className="row"><button className="btn">Commenter</button></div>
    </form>
  );
}
