'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
function toData(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 1200 / img.width), c = document.createElement('canvas');
      c.width = img.width * s; c.height = img.height * s;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = rej; img.src = URL.createObjectURL(file);
  });
}
export default function ArticleForm({ article }) {
  const r = useRouter();
  const [f, setF] = useState({ title: article?.title || '', content: article?.content || '', tags: article?.tags?.join(', ') || '', image: article?.image || '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function pick(e) { if (e.target.files[0]) setF({ ...f, image: await toData(e.target.files[0]) }); }
  async function submit(e) {
    e.preventDefault(); setError('');
    const res = await fetch(article ? `/api/articles/${article.id}` : '/api/articles', { method: article ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    const d = await res.json();
    if (!res.ok) return setError(d.error);
    r.push(article ? `/article/${article.id}` : '/'); r.refresh();
  }
  return (
    <form onSubmit={submit} className="form">
      <label>Titre<input value={f.title} onChange={set('title')} required /></label>
      <label>Photo de couverture<input type="file" accept="image/*" onChange={pick} /></label>
      {f.image && <img src={f.image} alt="Aperçu" className="preview" />}
      <label>Contenu<textarea rows={12} value={f.content} onChange={set('content')} required /></label>
      <label>Tags (séparés par des virgules)<input value={f.tags} onChange={set('tags')} placeholder="digital, actualité" /></label>
      {error && <p className="error">{error}</p>}
      <div className="row"><button className="btn">{article ? 'Enregistrer' : 'Publier'}</button><a className="link" href={article ? `/article/${article.id}` : '/'}>Annuler</a></div>
    </form>
  );
}
