import pg from 'pg';
const { Pool } = pg;

const g = globalThis;
const connectionString = process.env.DATABASE_URL;

// Supabase et les bases distantes exigent une connexion sécurisée SSL
const needsSSL = Boolean(
  connectionString && (
    connectionString.includes('supabase.co') ||
    connectionString.includes('pooler.supabase.com') ||
    connectionString.includes('sslmode=require') ||
    process.env.NODE_ENV === 'production'
  )
);

const pool = g.pgPool || (g.pgPool = new Pool({
  connectionString,
  ssl: needsSSL ? { rejectUnauthorized: false } : false,
}));

let ready;

function init() {
  return ready || (ready = pool.query(`
    CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());
    ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
    CREATE TABLE IF NOT EXISTS articles(id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id), title TEXT NOT NULL, content TEXT NOT NULL, image TEXT, tags TEXT[] DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT now());
    CREATE TABLE IF NOT EXISTS comments(id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(id) ON DELETE CASCADE, user_id INT REFERENCES users(id), content TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());
    UPDATE users SET role='admin' WHERE id=(SELECT min(id) FROM users) AND NOT EXISTS (SELECT 1 FROM users WHERE role='admin');`));
}

export async function q(text, params) {
  try {
    await init();
    return (await pool.query(text, params)).rows;
  } catch (e) {
    ready = null;
    console.error('[ERREUR BASE]', e.message, '|', text.slice(0, 80));
    throw e;
  }
}
