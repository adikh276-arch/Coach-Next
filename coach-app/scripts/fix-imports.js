const fs = require('fs');
const path = require('path');

const files = [
  'src/app/coaching_areas/_src/lib/db.ts',
  'src/app/coaching_integration/_src/lib/db.ts',
  'src/app/coach_journey/_src/lib/db.ts',
  'src/app/confidence_identity/_src/lib/db.ts',
  'src/app/daily_focus/_src/lib/db.ts',
  'src/app/emotional_regulation/_src/lib/db.ts',
  'src/app/goal_momentum/_src/lib/db.ts'
];

const content = `export { sql } from '../../../../lib/db';
export { default } from '../../../../lib/db';
`;

files.forEach(f => {
  const fullPath = path.join(__dirname, '..', f);
  if (fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed', f);
  }
});
