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
  
  // Remove .tsx and .ts from import paths
  content = content.replace(/from\s+[\"\'](\.\/.*?|\.\.\/.*?)(\.tsx|\.ts)[\"\']/g, 'from "$1"');
  
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed extensions in:', filepath);
  }
});
