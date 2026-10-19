import { notFound, redirect } from 'next/navigation';
import { q } from '../../../lib/db';
import { getMe } from '../../../lib/auth';
import ArticleForm from '../../../components/ArticleForm';
export const dynamic = 'force-dynamic';
export default async function Modifier({ params }) {
  const me = await getMe();
  if (!me) redirect('/connexion');
  const id = parseInt(params.id, 10);
  const [a] = id ? await q('SELECT id,user_id,title,content,image,tags FROM articles WHERE id=$1', [id]) : [];
  if (!a) notFound();
  if (me.role !== 'admin' && me.id !== a.user_id) redirect(`/article/${id}`);
  return <div className="wrap"><h1>Modifier l’article</h1><ArticleForm article={a} /></div>;
}
