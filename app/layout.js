import './globals.css';
import Link from 'next/link';
import { getUser } from '../lib/auth';
import Logout from '../components/Logout';
import { FACEBOOK_URL, DG_NAME } from '../lib/config';
export const metadata = { title: 'Blog Rengus Digital', description: 'Les actualités de Rengus Digital.' };
export default async function RootLayout({ children }) {
  const uid = await getUser();
  return (
    <html lang="fr"><body>
      <header><div className="bar">
        <Link href="/"><img src="/logo.jpeg" alt="Rengus Digital" className="logo" /></Link>
        <nav>
          <Link href="/" className="link">Accueil</Link>
          <Link href="/nouveau" className="btn">+ Nouvel article</Link>
          {uid ? <Logout /> : <Link href="/connexion" className="link">Connexion</Link>}
        </nav>
      </div></header>
      <main>{children}</main>
      <footer><div className="bar">
        <img src="/dg.jpg" alt={DG_NAME} className="dg" />
        <div>
          <strong>{DG_NAME}</strong>
          <p>Suivez la page Facebook de notre DG pour ne rien manquer de nos actualités.</p>
          <a className="btn" href={FACEBOOK_URL} target="_blank" rel="noreferrer">S’abonner sur Facebook</a>
        </div>
        <small>© {new Date().getFullYear()} Rengus Digital</small>
      </div></footer>
    </body></html>
  );
}
