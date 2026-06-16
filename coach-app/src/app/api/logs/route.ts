import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { activity, event_type, data, user_id } = body;

    await sql`
      INSERT INTO activity_logs (activity, event_type, data, user_id, created_at)
      VALUES (${activity}, ${event_type}, ${JSON.stringify(data)}, ${user_id}, NOW())
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Log error:', error);
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}
