# 📝 Blog Rengus Digital

Application de gestion et de publication des articles du blog Rengus (Next.js 14, PostgreSQL / Supabase, Tailwind CSS).

---

## 🗄️ Connexion Base de Données (Supabase)

Le projet est configuré pour se connecter à la base de données PostgreSQL hébergée sur **Supabase** :
* **Projet Supabase :** `https://hryahqnvirqvaolboglc.supabase.co`

### 1. Initialiser les tables et données sur Supabase
Un script complet de migration a été préparé : **`supabase_migration.sql`**.

Pour cloner la base locale vers Supabase en 1 clic :
1. Rendez-vous sur votre tableau de bord [Supabase Dashboard](https://supabase.com/dashboard/project/hryahqnvirqvaolboglc).
2. Cliquez sur l'onglet **SQL Editor** dans la barre latérale gauche.
3. Créez une **New query**.
4. Copiez-collez l'intégralité du contenu du fichier `supabase_migration.sql` et cliquez sur **Run**.
   * Toutes les tables (`users`, `articles`, `comments`) sont créées.
   * L'administrateur initial (`klose@rd.ga`) et l'article existant (*"OCTOBRE ROSE"*) sont automatiquement restaurés.

### 2. Configuration des variables d'environnement (`.env.local`)
Créez un fichier `.env.local` à la racine de `rengus-blog` :
```env
# Connexion PostgreSQL Supabase (Pooler IPv4 - Port 6543)
DATABASE_URL=postgresql://postgres.hryahqnvirqvaolboglc:[VOTRE-MOT-DE-PASSE-DB]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres

# Clé secrète pour les sessions administrateur
JWT_SECRET=rengus_jwt_secret_production_2026_super_secure
```

> **Note :** La couche de base de données (`lib/db.js`) active automatiquement le chiffrement SSL (`ssl: { rejectUnauthorized: false }`) dès qu'une URL Supabase est détectée.

---

## 🚀 Démarrage et Déploiement

### En développement local
```bash
npm install
npm run dev
```
Accès au blog : `http://localhost:3000` (ou `http://localhost:3001` si port 3000 occupé).

### En conteneur Docker (Optionnel)
```bash
docker compose up -d --build
```

### Compiler pour la production (Build)
```bash
npm run build
npm run start
```

---

## 🔌 Points d'Accès API pour le Site Vitrine

* **`GET /api/articles`** : Liste de tous les articles publiés (consommé en temps réel par le site vitrine via `BLOG_API_URL`).
* **`GET /api/articles/:id`** : Détail d'un article et ses commentaires.
* **`POST /api/auth`** : Connexion au panneau d'administration.
* **`POST /api/articles`** : Création d'un nouvel article (authentification requise).
