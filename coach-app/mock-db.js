const fs = require('fs');

const neonFiles = [
  'c:/Users/Mantra/Desktop/Coach/coach-app/src/app/success_habits/_src/lib/neon.ts',
  'c:/Users/Mantra/Desktop/Coach/coach-app/src/app/goal_momentum/_src/lib/db.ts',
  'c:/Users/Mantra/Desktop/Coach/coach-app/src/app/emotional_regulation/_src/lib/db.ts',
  'c:/Users/Mantra/Desktop/Coach/coach-app/src/app/daily_focus/_src/lib/db.ts',
  'c:/Users/Mantra/Desktop/Coach/coach-app/src/app/confidence_identity/_src/lib/tracker-storage.ts',
  'c:/Users/Mantra/Desktop/Coach/coach-app/src/app/coach_journey/_src/lib/db.ts',
  'c:/Users/Mantra/Desktop/Coach/coach-app/src/app/coaching_areas/_src/lib/db.ts',
  'c:/Users/Mantra/Desktop/Coach/coach-app/src/lib/db.ts'
];

const mockNeonContent = `
export const sql = async (...args: any[]) => {
  console.log('Mock DB call disabled for now:', args);
  return [];
};
export default sql;
`;

neonFiles.forEach(f => {
  if (fs.existsSync(f)) {
    fs.writeFileSync(f, mockNeonContent, 'utf8');
    console.log('Mocked neon:', f);
  }
});

const supabaseFile = 'c:/Users/Mantra/Desktop/Coach/coach-app/src/app/confidence_identity/_src/integrations/supabase/client.ts';
const mockSupabaseContent = `
const createMockSupabase = () => {
  const handler = {
    get(target: any, prop: string): any {
      if (prop === 'auth') {
        return {
          getSession: async () => ({ data: { session: null } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signOut: async () => ({ error: null }),
        };
      }
      return new Proxy(() => {}, handler);
    },
    apply() {
      return new Proxy(() => {}, handler);
    }
  };
  return new Proxy({}, handler);
};

export const supabase = createMockSupabase();
`;

if (fs.existsSync(supabaseFile)) {
  fs.writeFileSync(supabaseFile, mockSupabaseContent, 'utf8');
  console.log('Mocked supabase:', supabaseFile);
}
