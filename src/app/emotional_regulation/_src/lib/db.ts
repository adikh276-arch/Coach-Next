import { neon } from '@neondatabase/serverless';

const getTargetUrl = () => {
  // 1. Try runtime configuration injected into window (best for Docker/Nginx)
  const runtimeUrl = (window as any).ENV_CONFIG?.VITE_NEON_DATABASE_URL || (window as any).ENV_CONFIG?.DATABASE_URL;
  if (runtimeUrl && !runtimeUrl.includes('__VITE_')) return runtimeUrl;

  // 2. Try Next.js public env var (best for Vercel/Local)
  const nextPublicUrl = process.env.NEXT_PUBLIC_DATABASE_URL;
  if (nextPublicUrl) return nextPublicUrl;
  
  // 3. Try standard build-time env var
  const buildTimeUrl = process.env.DATABASE_URL;
  if (buildTimeUrl && !buildTimeUrl.includes('__VITE_')) return buildTimeUrl;
  
  return null;
};

const databaseUrl = getTargetUrl();

if (!databaseUrl) {
  console.warn('[db] DATABASE_URL not found. Database integration will remain disabled.');
}

const baseSql = databaseUrl ? neon(databaseUrl) : null;

export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  if (!baseSql) {
    console.warn('[db] SQL called but DATABASE_URL is missing.');
    return [];
  }

  try {
    return await baseSql(strings, ...values);
  } catch (err: any) {
    const msg = err.message || '';
    if (msg.includes('relation') && (msg.includes('does not exist') || msg.includes('not found'))) {
      console.warn(`[db] Table missing: ${msg}. Falling back to empty result.`);
      return [];
    }
    // Re-throw other errors
    throw err;
  }
};

export default sql;
