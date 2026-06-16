const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set in env or .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
  try {
    console.log('Creating table...');
    await sql`
      CREATE TABLE IF NOT EXISTS emotional_regulation_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        entry_date TEXT NOT NULL,
        timestamp BIGINT NOT NULL,
        stability INTEGER NOT NULL,
        stress INTEGER NOT NULL,
        challenging_situation BOOLEAN NOT NULL,
        response_quality TEXT,
        context TEXT,
        thoughts TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, entry_date)
      );
    `;
    console.log('Table emotional_regulation_entries created successfully.');
  } catch (err) {
    console.error('Failed to create table:', err);
  }
}

main();
