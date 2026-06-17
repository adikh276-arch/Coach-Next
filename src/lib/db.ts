import "server-only";
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('[db] DATABASE_URL not found. Using placeholder for build/initialization.');
}

export const sql = neon(databaseUrl || 'postgres://dummy:dummy@dummy.neon.tech/dummy');
export default sql;
