import type { D1Database } from '@cloudflare/workers-types';

export function getDb(platform: App.Platform): D1Database {
  const db = platform?.env?.DB as D1Database | undefined;
  if (!db) throw new Error('D1 DB binding missing (platform.env.DB).');
  return db;
}