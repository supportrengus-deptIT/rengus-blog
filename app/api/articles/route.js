import { q } from '../../../lib/db';
import { getUser } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const articles = await q(
    'SELECT id,title,content,image,tags,created_at FROM articles ORDER BY created_at DESC'
  );
  return Response.json(articles, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

export async function POST(req) {
  const uid = await getUser();
  if (!uid) return Response.json({ error: 'Connectez-vous pour publier.' }, { status: 401 });
  const { title, content, image, tags } = await req.json();
  if (!String(title || '').trim() || !String(content || '').trim())
    return Response.json({ error: 'Le titre et le contenu sont obligatoires.' }, { status: 400 });
  const t = String(tags || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 8);
  const [a] = await q(
    'INSERT INTO articles(user_id,title,content,image,tags) VALUES($1,$2,$3,$4,$5) RETURNING id',
    [uid, title.trim(), content, image || null, t]
  );
  return Response.json({ id: a.id }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
