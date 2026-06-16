import { neon } from "@neondatabase/serverless";

/**
 * Database connection.
 * The DATABASE_URL secret is injected at RUNTIME by the container platform —
 * it is NEVER baked into the Docker image.
 *
 * In production: set DATABASE_URL as a secret/env var in the container registry.
 * Locally:       create a .env.local file with DATABASE_URL=<your-neon-url>
 */
const getTargetUrl = () => {
  const runtimeUrl = (window as any).ENV_CONFIG?.VITE_NEON_DATABASE_URL || (window as any).ENV_CONFIG?.DATABASE_URL;
  if (runtimeUrl && !runtimeUrl.includes('__VITE_')) return runtimeUrl;

  const nextPublicUrl = process.env.NEXT_PUBLIC_DATABASE_URL;
  if (nextPublicUrl) return nextPublicUrl;
  
  const buildTimeUrl = process.env.DATABASE_URL;
  if (buildTimeUrl && !buildTimeUrl.includes('__VITE_')) return buildTimeUrl;
  
  return null;
};

const CONNECTION = getTargetUrl();

if (!CONNECTION) {
  console.error("[db] DATABASE_URL is not set. Database integration will remain disabled.");
}

const baseSql = CONNECTION ? neon(CONNECTION) : null;

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
