"use server";

import { sql } from '@/lib/db';
import { z } from 'zod';

const syncUserSchema = z.object({
  userId: z.union([z.string(), z.number()]).transform(v => v.toString())
});

export async function syncUser(userId: string | number) {
  try {
    const parsed = syncUserSchema.parse({ userId });
    await sql`INSERT INTO users (id) VALUES (${parsed.userId}) ON CONFLICT DO NOTHING`;
    return { success: true };
  } catch (err) {
    console.error('Failed to sync user:', err);
    return { success: false, error: 'Failed to sync user' };
  }
}
