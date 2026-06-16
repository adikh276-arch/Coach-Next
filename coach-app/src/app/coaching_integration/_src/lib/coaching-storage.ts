import { sql } from './db';

export interface CoachingEntry {
  id?: number;
  user_id: string;
  date: string;
  implemented: boolean;
  implementation_depth: string | null;
  accountability_score: number;
  session_value: number;
  next_action: string | null;
  created_at: string;
}

export async function getEntries(userId: string): Promise<CoachingEntry[]> {
  try {
    const result = await sql`
      SELECT * FROM coaching_integration_entries 
      WHERE user_id = ${userId} 
      ORDER BY date DESC
    `;
    return result.map(row => ({
      ...row,
      date: new Date(row.date).toISOString().slice(0, 10),
    })) as CoachingEntry[];
  } catch (err) {
    console.error('Error fetching entries:', err);
    return [];
  }
}

export async function getTodayEntry(userId: string): Promise<CoachingEntry | null> {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const result = await sql`
      SELECT * FROM coaching_integration_entries 
      WHERE user_id = ${userId} AND date = ${today}
      LIMIT 1
    `;
    if (result.length === 0) return null;
    return {
      ...result[0],
      date: new Date(result[0].date).toISOString().slice(0, 10),
    } as CoachingEntry;
  } catch (err) {
    console.error('Error fetching today entry:', err);
    return null;
  }
}

export async function saveEntry(userId: string, entry: Omit<CoachingEntry, 'date' | 'created_at' | 'user_id'>): Promise<CoachingEntry> {
  const today = new Date().toISOString().slice(0, 10);

  try {
    await sql`
      INSERT INTO coaching_integration_entries (
        user_id, date, implemented, implementation_depth, 
        accountability_score, session_value, next_action
      ) VALUES (
        ${userId}, ${today}, ${entry.implemented}, ${entry.implementation_depth}, 
        ${entry.accountability_score}, ${entry.session_value}, ${entry.next_action}
      )
      ON CONFLICT (user_id, date) DO UPDATE SET
        implemented = EXCLUDED.implemented,
        implementation_depth = EXCLUDED.implementation_depth,
        accountability_score = EXCLUDED.accountability_score,
        session_value = EXCLUDED.session_value,
        next_action = EXCLUDED.next_action,
        created_at = CURRENT_TIMESTAMP
    `;
    
    return {
      ...entry,
      user_id: userId,
      date: today,
      created_at: new Date().toISOString()
    } as CoachingEntry;
  } catch (err) {
    console.error('Error saving entry:', err);
    throw err;
  }
}

export function computeIndex(entries: CoachingEntry[]): number {
  if (entries.length === 0) return 0;
  const recent = entries.slice(0, 7); // Already sorted DESC in getEntries
  const avg = (arr: number[]) => arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

  const implScore =
    recent.filter((e) => e.implemented).length / Math.max(recent.length, 1);
  
  const depthMap: Record<string, number> = {
    "Tried It Briefly": 0.33,
    "Partially Applied": 0.66,
    "Fully Implemented": 1,
  };
  
  const implWithDepth = recent.filter((e) => e.implemented && e.implementation_depth);
  const depthScore =
    implWithDepth.length > 0
      ? avg(implWithDepth.map((e) => depthMap[e.implementation_depth!] ?? 0.5))
      : 0;
      
  const combinedImpl = implScore * 0.5 + depthScore * 0.5;

  const accountabilityScore = avg(recent.map((e) => Number(e.accountability_score))) / 10;
  const sessionScore = avg(recent.map((e) => Number(e.session_value))) / 10;

  return Math.round((combinedImpl * 0.4 + accountabilityScore * 0.3 + sessionScore * 0.3) * 100);
}

export function getSmartInsight(entries: CoachingEntry[]): string {
  if (entries.length < 2) return "Keep logging to unlock personalized insights.";
  const recent = entries.slice(0, 7);
  const implRate = recent.filter((e) => e.implemented).length / recent.length;
  const avgAcc = recent.reduce((a, e) => a + e.accountability_score, 0) / recent.length;

  if (implRate >= 0.7 && avgAcc >= 7)
    return "Strong momentum — high accountability is driving consistent implementation.";
  if (implRate >= 0.7)
    return "Great implementation rate. Boosting accountability could amplify your results.";
  if (avgAcc >= 7)
    return "High accountability detected. Focus on applying learnings to unlock full potential.";
  return "Consistent tracking builds awareness — keep logging to strengthen your coaching integration.";
}
