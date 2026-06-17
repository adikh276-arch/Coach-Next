const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

async function migrate() {
  console.log('🔗 Connecting to Neon...');
  const sql = neon(DATABASE_URL);
  
  const migrationPath = path.join(__dirname, 'migration.sql');
  const rawSQL = fs.readFileSync(migrationPath, 'utf-8');
  
  // Remove comments and split by semicolons
  const cleaned = rawSQL.replace(/--.*$/gm, '');
  const statements = cleaned
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`📋 Running ${statements.length} SQL statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 80).replace(/\n/g, ' ');
    try {
      await sql.query(stmt);
      console.log(`  ✅ [${i + 1}/${statements.length}] ${preview}...`);
    } catch (err) {
      console.error(`  ❌ [${i + 1}/${statements.length}] ${preview}...`);
      console.error(`     Error: ${err.message}`);
    }
  }
  
  console.log('\n✅ Migration complete!');
  
  // Verify tables
  const tables = await sql`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `;
  console.log('\n📊 Tables in database:');
  tables.forEach(t => console.log(`  - ${t.table_name}`));
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
