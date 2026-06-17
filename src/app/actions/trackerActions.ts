"use server";

import { sql } from '@/lib/db';
import { z } from 'zod';

const userIdSchema = z.string();

export async function getTrackerEntries(userId: string) {
  try {
    const id = userIdSchema.parse(userId);
    const rows = await sql`
      SELECT date, confidence_score, decisiveness_score, avoided, avoidance_reason, custom_reason_text, context, created_at
      FROM confidence_tracker_entries
      WHERE user_id = ${id}
      ORDER BY date DESC
    `;
    return { success: true, data: rows };
  } catch (err) {
    console.error('Failed to fetch tracker entries:', err);
    return { success: false, error: 'Failed to fetch entries' };
  }
}

const saveEntrySchema = z.object({
  userId: z.string(),
  date: z.string(),
  confidence_score: z.number(),
  decisiveness_score: z.number(),
  avoided: z.boolean(),
  avoidance_reason: z.string().nullable(),
  custom_reason_text: z.string().nullable(),
  context: z.string().nullable(),
  created_at: z.number(),
});

export async function saveTrackerEntry(payload: z.infer<typeof saveEntrySchema>) {
  try {
    const p = saveEntrySchema.parse(payload);
    
    // Ensure user exists before saving data
    await sql`
      INSERT INTO users (id) 
      VALUES (${p.userId}) 
      ON CONFLICT (id) DO NOTHING
    `;

    await sql`
      INSERT INTO confidence_tracker_entries (
        user_id, date, confidence_score, decisiveness_score, avoided, avoidance_reason, custom_reason_text, context, created_at
      ) VALUES (
        ${p.userId}, ${p.date}, ${p.confidence_score}, ${p.decisiveness_score}, ${p.avoided}, ${p.avoidance_reason}, ${p.custom_reason_text}, ${p.context}, ${p.created_at}
      )
      ON CONFLICT (user_id, date) DO UPDATE SET
        confidence_score = EXCLUDED.confidence_score,
        decisiveness_score = EXCLUDED.decisiveness_score,
        avoided = EXCLUDED.avoided,
        avoidance_reason = EXCLUDED.avoidance_reason,
        custom_reason_text = EXCLUDED.custom_reason_text,
        context = EXCLUDED.context,
        created_at = EXCLUDED.created_at
    `;
    return { success: true };
  } catch (err) {
    console.error('Failed to save tracker entry:', err);
    return { success: false, error: 'Failed to save entry' };
  }
}
