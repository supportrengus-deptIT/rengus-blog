import Link from 'next/link';
import { notFound } from 'next/navigation';
import { q } from '../../../lib/db';
import { getMe } from '../../../lib/auth';
import DeleteButton from '../../../components/Actions';
import CommentForm from '../../../components/CommentForm';
export const dynamic = 'force-dynamic';
const date = (d) => new Date(d).toLocaleDateString('fr-FR', { dateStyle: 'long' });
export default async function Article({ params }) {
  const id = parseInt(params.id, 10);
  if (!id) notFound();
  const [a] = await q('SELECT user_id,title,content,image,tags,created_at FROM articles WHERE id=$1', [id]);
  if (!a) notFound();
  const me = await getMe();
  const admin = me?.role === 'admin';
  const comments = await q('SELECT c.id,c.user_id,c.content,c.created_at,u.email FROM comments c JOIN users u ON u.id=c.user_id WHERE c.article_id=$1 ORDER BY c.created_at', [id]);
  return (
    <div className="wrap">
      <a href="/" className="link">Retour aux articles</a>
      <h1>{a.title}</h1>
      <time className="muted">{date(a.created_at)}</time>
      {(admin || me?.id === a.user_id) && (
        <div className="row"><Link href={`/modifier/${id}`} className="link">Modifier</Link>
          <DeleteButton url={`/api/articles/${id}`} after="/" confirmText="Supprimer cet article et ses commentaires ?" /></div>
      )}
      {a.image && <img src={a.image} alt="" className="cover" />}
      <p className="body">{a.content}</p>
      <div className="tags">{a.tags.map((t) => <Link key={t} href={`/?tag=${encodeURIComponent(t)}`}>{t}</Link>)}</div>
      <h2>Commentaires ({comments.length})</h2>
      {comments.map((c) => (
        <div key={c.id} className="comment">
          <strong>{c.email.split('@')[0]}</strong> <span className="muted">{date(c.created_at)}</span>
          <p>{c.content}</p>
          {(admin || me?.id === c.user_id) && <DeleteButton url={`/api/comments/${c.id}`} confirmText="Supprimer ce commentaire ?" />}
        </div>
      ))}
      {me ? <CommentForm articleId={id} /> : <p className="muted"><Link href="/connexion" className="link">Connectez-vous</Link> pour commenter.</p>}
    </div>
  );
}
