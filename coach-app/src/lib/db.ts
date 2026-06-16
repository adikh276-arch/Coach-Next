import { neon } from '@neondatabase/serverless';

const getTargetUrl = () => {
  // 1. Try runtime configuration injected into window (best for Docker/Nginx)
  if (typeof window !== 'undefined') {
    const runtimeUrl = (window as any).ENV_CONFIG?.VITE_NEON_DATABASE_URL || (window as any).ENV_CONFIG?.DATABASE_URL;
    if (runtimeUrl && !runtimeUrl.includes('__VITE_')) return runtimeUrl;
  }

  // 2. Try Next.js public env var (best for Vercel/Local)
  const nextPublicUrl = process.env.NEXT_PUBLIC_DATABASE_URL;
  if (nextPublicUrl) return nextPublicUrl;
  
  // 3. Try standard build-time env var
  const buildTimeUrl = process.env.DATABASE_URL;
  if (buildTimeUrl && !buildTimeUrl.includes('__VITE_')) return buildTimeUrl;
  
  return null;
};

const databaseUrl = getTargetUrl() || 'postgres://dummy:dummy@dummy.neon.tech/dummy';

if (!getTargetUrl()) {
  console.warn('[db] DATABASE_URL not found. Using placeholder for build/initialization.');
}

export const sql = neon(databaseUrl);
export default sql;
