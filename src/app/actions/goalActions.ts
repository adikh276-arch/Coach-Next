"use server";

import { sql } from '@/lib/db';
import { z } from 'zod';

const userIdSchema = z.string();

export async function fetchUserGoals(userId: string) {
  try {
    const id = userIdSchema.parse(userId);
    const rawGoals = await sql`SELECT * FROM goals WHERE user_id = ${id} ORDER BY created_at DESC`;
    return { success: true, data: rawGoals };
  } catch (err) {
    console.error('Failed to fetch goals:', err);
    return { success: false, error: 'Failed to fetch goals' };
  }
}

export async function fetchGoalEntries(userId: string) {
  try {
    const id = userIdSchema.parse(userId);
    const entriesRaw = await sql`
      SELECT * FROM goal_entries WHERE goal_id IN (SELECT id FROM goals WHERE user_id = ${id}) ORDER BY date DESC
    `;
    return { success: true, data: entriesRaw };
  } catch (err) {
    console.error('Failed to fetch goal entries:', err);
    return { success: false, error: 'Failed to fetch entries' };
  }
}

const addGoalSchema = z.object({
  userId: z.string(),
  name: z.string(),
  category: z.string().default('learning'),
});

export async function addGoal(payload: z.infer<typeof addGoalSchema>) {
  try {
    const p = addGoalSchema.parse(payload);
    const result = await sql`
      INSERT INTO goals (user_id, name, category) VALUES (${p.userId}, ${p.name}, ${p.category}) RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (err) {
    console.error('Failed to add goal:', err);
    return { success: false, error: 'Failed to add goal' };
  }
}

const deleteGoalSchema = z.string();

export async function deleteGoal(goalId: string) {
  try {
    const id = deleteGoalSchema.parse(goalId);
    await sql`DELETE FROM goals WHERE id = ${id}`;
    return { success: true };
  } catch (err) {
    console.error('Failed to delete goal:', err);
    return { success: false, error: 'Failed to delete goal' };
  }
}

const saveEntrySchema = z.object({
  goalId: z.string(),
  dateKey: z.string(),
  drive: z.number(),
  energy: z.number(),
  focus: z.number(),
  clarity: z.number(),
  tookAction: z.boolean(),
  impactLevel: z.number(),
  actionNote: z.string(),
  blocker: z.string(),
});

export async function saveGoalEntry(payload: z.infer<typeof saveEntrySchema>) {
  try {
    const p = saveEntrySchema.parse(payload);
    const result = await sql`
       INSERT INTO goal_entries (goal_id, date, drive, energy, focus, clarity, took_action, impact_level, action_note, blocker)
       VALUES (${p.goalId}, ${p.dateKey}, ${p.drive}, ${p.energy}, ${p.focus}, ${p.clarity}, ${p.tookAction}, ${p.impactLevel}, ${p.actionNote}, ${p.blocker})
       ON CONFLICT (goal_id, date) DO UPDATE SET
         drive = EXCLUDED.drive,
         energy = EXCLUDED.energy,
         focus = EXCLUDED.focus,
         clarity = EXCLUDED.clarity,
         took_action = EXCLUDED.took_action,
         impact_level = EXCLUDED.impact_level,
         action_note = EXCLUDED.action_note,
         blocker = EXCLUDED.blocker
       RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (err) {
    console.error('Failed to save entry:', err);
    return { success: false, error: 'Failed to save entry' };
  }
}
