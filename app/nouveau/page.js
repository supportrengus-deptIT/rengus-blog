import { redirect } from 'next/navigation';
import { getUser } from '../../lib/auth';
import ArticleForm from '../../components/ArticleForm';
export const metadata = { title: 'Nouvel article' };
export default async function Nouveau() {
  if (!(await getUser())) redirect('/connexion');
  return <div className="wrap"><h1>Nouvel article</h1><ArticleForm /></div>;
}
