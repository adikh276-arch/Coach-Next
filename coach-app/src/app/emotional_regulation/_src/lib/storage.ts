import { sql } from './db';

export interface TrackerEntry {
  id?: string;
  user_id?: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  stability: number;
  stress: number;
  challengingSituation: boolean;
  responseQuality?: "Reactive" | "Managed" | "Composed" | "Strategic";
  context?: string;
  thoughts?: string;
}

const STORAGE_KEY = "emotional_tracker_entries_cache";

/**
 * Retrieves the validated user_id from sessionStorage.
 * This is the single source of truth established during the handshake.
 */
function getUserId(): string {
  const userId = sessionStorage.getItem("user_id");
  if (!userId) {
    // If somehow we get here without a user_id, a redirect should have already happened.
    // However, for type safety and as a hard stop:
    throw new Error("Unauthorized: No session user_id found.");
  }
  return userId;
}

export async function getEntries(): Promise<TrackerEntry[]> {
  const userId = getUserId();
  try {
    const result = await sql`
      SELECT * FROM emotional_regulation_entries 
      WHERE user_id = ${userId} 
      ORDER BY entry_date DESC, timestamp DESC
    `;
    
    const entries = result.map(row => ({
      id: row.id,
      user_id: String(row.user_id),
      date: String(row.entry_date),
      timestamp: Number(row.timestamp),
      stability: Number(row.stability),
      stress: Number(row.stress),
      challengingSituation: row.challenging_situation,
      responseQuality: row.response_quality,
      context: row.context,
      thoughts: row.thoughts
    }));

    // Local cache for performance/backup
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return entries;
  } catch (error) {
    console.error('Error fetching entries from Neon:', error);
    // Fallback to cache if DB fails
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
}

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getTodayEntry(): Promise<TrackerEntry | undefined> {
  const entries = await getEntries();
  return entries.find((e) => e.date === getTodayKey());
}

export async function saveEntry(entry: Omit<TrackerEntry, "date" | "timestamp">): Promise<TrackerEntry> {
  const userId = getUserId();
  const date = getTodayKey();
  const timestamp = Date.now();

  try {
    // Attempt to upsert
    const result = await sql`
      INSERT INTO emotional_regulation_entries (
        user_id, entry_date, timestamp, stability, stress, 
        challenging_situation, response_quality, context, thoughts
      )
      VALUES (
        ${userId}, ${date}, ${timestamp}, ${entry.stability}, ${entry.stress},
        ${entry.challengingSituation}, ${entry.responseQuality || null}, 
        ${entry.context || null}, ${entry.thoughts || null}
      )
      ON CONFLICT (user_id, entry_date) DO UPDATE SET
        stability = EXCLUDED.stability,
        stress = EXCLUDED.stress,
        challenging_situation = EXCLUDED.challenging_situation,
        response_quality = EXCLUDED.response_quality,
        context = EXCLUDED.context,
        thoughts = EXCLUDED.thoughts
      RETURNING *
    `;

    // Refresh entries to sync cache
    await getEntries();

    const row = result[0];
    return {
      id: row.id,
      user_id: String(row.user_id),
      date: String(row.entry_date),
      timestamp: Number(row.timestamp),
      stability: Number(row.stability),
      stress: Number(row.stress),
      challengingSituation: row.challenging_situation,
      responseQuality: row.response_quality,
      context: row.context,
      thoughts: row.thoughts
    };
  } catch (error) {
    console.error('Error saving entry to Neon:', error);
    // Hard failure preferred for security, but we can maintain a local temp save if needed.
    // However, given the "Source of Truth" requirement, we'll propagate the error for the UI.
    throw error;
  }
}
