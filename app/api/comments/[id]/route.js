import { q } from '../../../../lib/db';
import { getMe } from '../../../../lib/auth';
export async function DELETE(_, { params }) {
  const me = await getMe(), id = parseInt(params.id, 10);
  if (!me) return Response.json({ error: 'Connectez-vous.' }, { status: 401 });
  const [c] = id ? await q('SELECT user_id FROM comments WHERE id=$1', [id]) : [];
  if (!c) return Response.json({ error: 'Commentaire introuvable.' }, { status: 404 });
  if (me.role !== 'admin' && me.id !== c.user_id) return Response.json({ error: 'Action non autorisée.' }, { status: 403 });
  await q('DELETE FROM comments WHERE id=$1', [id]);
  console.log(`[COMMENTAIRE] Supprimé : #${id} par ${me.email}`);
  return Response.json({ ok: true });
}
