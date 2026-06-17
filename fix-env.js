const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('c:/Users/Mantra/Desktop/Coach/coach-app/src/app');

function walkSync(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    let filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkSync(filepath, callback);
    } else {
      if (filepath.endsWith('.ts') || filepath.endsWith('.tsx')) {
        callback(filepath);
      }
    }
  });
}

walkSync(baseDir, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  
  content = content.replace(/import\.meta\.env\.DEV/g, "(process.env.NODE_ENV === 'development')");
  content = content.replace(/import\.meta\.env\.VITE_([A-Z0-9_]+)/g, "process.env.NEXT_PUBLIC_$1");
  content = content.replace(/import\.meta\.env\.([A-Z0-9_]+)/g, "process.env.NEXT_PUBLIC_$1");
  
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed env vars in:', filepath);
  }
});
