import Link from 'next/link';
import { q } from '../lib/db';
import { getMe } from '../lib/auth';
import DeleteButton from '../components/Actions';

export const dynamic = 'force-dynamic';

const date = (d) => new Date(d).toLocaleDateString('fr-FR', { dateStyle: 'long' });

export default async function Home({ searchParams }) {
  const me = await getMe();
  const admin = me?.role === 'admin';
  const s = String(searchParams.q || '').trim(), tag = String(searchParams.tag || '').trim();

  const rows = await q(
    `SELECT id,user_id,title,content,image,tags,created_at FROM articles
     WHERE ($1::text='' OR title ILIKE '%'||$1::text||'%' OR content ILIKE '%'||$1::text||'%')
       AND ($2::text='' OR $2::text=ANY(tags))
     ORDER BY created_at DESC`,
    [s, tag]
  );

  const all = await q('SELECT DISTINCT unnest(tags) AS t FROM articles ORDER BY t');

  return (
    <div className="wrap">
      <h1>Le blog de Rengus Digital</h1>
      <form className="search" action="/">
        <input name="q" defaultValue={s} placeholder="Rechercher un article" />
        {tag && <input type="hidden" name="tag" value={tag} />}
        <button className="btn">Rechercher</button>
      </form>
      <div className="tags">
        {all.map(({ t }) => (
          <Link key={t} href={`/?tag=${encodeURIComponent(t)}`} className={t === tag ? 'on' : ''}>
            {t}
          </Link>
        ))}
      </div>
      {(s || tag) && (
        <p className="muted">
          {rows.length} résultat(s){tag && ` pour le tag « ${tag} »`}{s && ` pour « ${s} »`}.{' '}
          <Link href="/" className="link">Tout afficher</Link>
        </p>
      )}
      {rows.length === 0 && !s && !tag && (
        <p className="muted">
          Aucun article pour l’instant. Cliquez sur « + Nouvel article » pour publier le premier.
        </p>
      )}
      {rows.map((a) => (
        <article key={a.id} className="card">
          {a.image && <img src={a.image} alt="" />}
          <div>
            <time className="muted">{date(a.created_at)}</time>
            <h2>{a.title}</h2>
            <p>{a.content.slice(0, 220)}{a.content.length > 220 ? '…' : ''}</p>
            <div className="tags">
              {a.tags.map((t) => (
                <Link key={t} href={`/?tag=${encodeURIComponent(t)}`}>{t}</Link>
              ))}
            </div>
            <div className="row" style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href={`/article/${a.id}`} className="link">Voir plus</Link>
              {(admin || me?.id === a.user_id) && (
                <>
                  <Link href={`/modifier/${a.id}`} className="link" style={{ color: '#0066cc' }}>Modifier</Link>
                  <DeleteButton url={`/api/articles/${a.id}`} after="/" confirmText="Supprimer cet article ?" label="Supprimer" />
                </>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
