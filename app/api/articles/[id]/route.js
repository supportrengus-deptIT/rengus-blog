import { q } from '../../../../lib/db';
import { getMe } from '../../../../lib/auth';
export const dynamic = 'force-dynamic';
const msg = { 401: 'Connectez-vous.', 403: 'Action réservée à l’auteur ou à un administrateur.', 404: 'Article introuvable.' };
async function allowed(id) {
  const me = await getMe();
  if (!me) return [null, 401];
  const [a] = id ? await q('SELECT user_id FROM articles WHERE id=$1', [id]) : [];
  if (!a) return [null, 404];
  return me.role === 'admin' || me.id === a.user_id ? [me, 0] : [null, 403];
}
export async function GET(_, { params }) {
  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: 'Article introuvable.' }, { status: 404 });
  }
  const [article] = await q(
    'SELECT id,title,content,image,tags,created_at FROM articles WHERE id=$1',
    [id]
  );
  if (!article) return Response.json({ error: 'Article introuvable.' }, { status: 404 });
  return Response.json(article);
}

export async function PUT(req, { params }) {
  const id = parseInt(params.id, 10), [me, s] = await allowed(id);
  if (!me) return Response.json({ error: msg[s] }, { status: s });
  const { title, content, image, tags } = await req.json();
  if (!String(title || '').trim() || !String(content || '').trim()) return Response.json({ error: 'Le titre et le contenu sont obligatoires.' }, { status: 400 });
  const t = String(tags || '').split(',').map((x) => x.trim()).filter(Boolean).slice(0, 8);
  await q('UPDATE articles SET title=$1,content=$2,image=$3,tags=$4 WHERE id=$5', [title.trim(), content, image || null, t, id]);
  console.log(`[ARTICLE] Modifié : #${id} par ${me.email}`);
  return Response.json({ ok: true });
}
export async function DELETE(_, { params }) {
  const id = parseInt(params.id, 10), [me, s] = await allowed(id);
  if (!me) return Response.json({ error: msg[s] }, { status: s });
  await q('DELETE FROM articles WHERE id=$1', [id]);
  console.log(`[ARTICLE] Supprimé : #${id} par ${me.email}`);
  return Response.json({ ok: true });
}
