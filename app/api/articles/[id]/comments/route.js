import { q } from '../../../../../lib/db';
import { getMe } from '../../../../../lib/auth';
export async function POST(req, { params }) {
  const me = await getMe(), id = parseInt(params.id, 10);
  if (!me) return Response.json({ error: 'Connectez-vous pour commenter.' }, { status: 401 });
  const { content } = await req.json();
  const c = String(content || '').trim().slice(0, 1000);
  if (!c) return Response.json({ error: 'Le commentaire est vide.' }, { status: 400 });
  if (!id || !(await q('SELECT 1 FROM articles WHERE id=$1', [id])).length) return Response.json({ error: 'Article introuvable.' }, { status: 404 });
  await q('INSERT INTO comments(article_id,user_id,content) VALUES($1,$2,$3)', [id, me.id, c]);
  console.log(`[COMMENTAIRE] Ajouté sur l'article #${id} par ${me.email}`);
  return Response.json({ ok: true });
}
