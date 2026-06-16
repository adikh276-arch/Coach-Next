const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function setup() {
  console.log('🚀 Starting Database Setup...');
  
  try {
    // 1. Users Table
    console.log('Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Goals Table
    console.log('Creating goals table...');
    await sql`
      CREATE TABLE IF NOT EXISTS goals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT REFERENCES users(id),
        name TEXT NOT NULL,
        category TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Goal Entries Table (Renamed from entries)
    console.log('Creating goal_entries table...');
    await sql`
      CREATE TABLE IF NOT EXISTS goal_entries (
        id SERIAL PRIMARY KEY,
        goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        drive INTEGER,
        energy INTEGER,
        focus INTEGER,
        clarity INTEGER,
        took_action BOOLEAN,
        impact_level INTEGER,
        action_note TEXT,
        blocker TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(goal_id, date)
      );
    `;

    // 4. Performance Entries (Daily Focus)
    console.log('Creating performance_entries table...');
    await sql`
      CREATE TABLE IF NOT EXISTS performance_entries (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        date DATE NOT NULL,
        execution_score INTEGER,
        mental_clarity INTEGER,
        priority_completed BOOLEAN,
        priority_completion_text TEXT,
        primary_blocker TEXT,
        custom_blocker_text TEXT,
        productivity_depth TEXT,
        custom_work_depth_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date)
      );
    `;

    // 5. Emotional Regulation Entries (Renamed from entries)
    console.log('Creating emotional_regulation_entries table...');
    await sql`
      CREATE TABLE IF NOT EXISTS emotional_regulation_entries (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        entry_date DATE NOT NULL,
        timestamp BIGINT,
        stability INTEGER,
        stress INTEGER,
        challenging_situation BOOLEAN,
        response_quality TEXT,
        context TEXT,
        thoughts TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, entry_date)
      );
    `;

    // 6. Confidence Tracker Entries
    console.log('Creating confidence_tracker_entries table...');
    await sql`
      CREATE TABLE IF NOT EXISTS confidence_tracker_entries (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        date DATE NOT NULL,
        confidence_score INTEGER,
        decisiveness_score INTEGER,
        avoided BOOLEAN,
        avoidance_reason TEXT,
        custom_reason_text TEXT,
        context TEXT,
        created_at BIGINT,
        UNIQUE(user_id, date)
      );
    `;

    // 7. Assessment Results
    console.log('Creating assessment_results table...');
    await sql`
      CREATE TABLE IF NOT EXISTS assessment_results (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        assessment_id TEXT NOT NULL,
        completed_at TIMESTAMP NOT NULL
      );
    `;

    // 8. Assessment Answers
    console.log('Creating assessment_answers table...');
    await sql`
      CREATE TABLE IF NOT EXISTS assessment_answers (
        id SERIAL PRIMARY KEY,
        result_id INTEGER REFERENCES assessment_results(id) ON DELETE CASCADE,
        question_id TEXT NOT NULL,
        value INTEGER NOT NULL
      );
    `;

    // 9. Coaching Integration Entries
    console.log('Creating coaching_integration_entries table...');
    await sql`
      CREATE TABLE IF NOT EXISTS coaching_integration_entries (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        date DATE NOT NULL,
        implemented BOOLEAN,
        implementation_depth TEXT,
        accountability_score INTEGER,
        session_value INTEGER,
        next_action TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date)
      );
    `;

    // 10. Exercise Sessions
    console.log('Creating exercise_sessions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS exercise_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT REFERENCES users(id),
        coaching_area_id TEXT,
        exercise_id TEXT,
        status TEXT,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 11. Exercise Responses
    console.log('Creating exercise_responses table...');
    await sql`
      CREATE TABLE IF NOT EXISTS exercise_responses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES exercise_sessions(id) ON DELETE CASCADE,
        field_id TEXT NOT NULL,
        field_label TEXT,
        field_type TEXT,
        response_text TEXT,
        response_json JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, field_id)
      );
    `;

    // 12. Special Exercise Responses
    console.log('Creating special_exercise_responses table...');
    await sql`
      CREATE TABLE IF NOT EXISTS special_exercise_responses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES exercise_sessions(id) ON DELETE CASCADE,
        special_type TEXT NOT NULL,
        response_data JSONB,
        score INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id)
      );
    `;

    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setup();
