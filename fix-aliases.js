const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('c:/Users/Mantra/Desktop/Coach/coach-app/src/app');
const activities = ['daily_focus', 'goal_momentum'];

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

activities.forEach(activity => {
  const srcDir = path.join(baseDir, activity, '_src');
  walkSync(srcDir, (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;
    
    const relPath = path.relative(path.dirname(filepath), srcDir);
    let prefix = relPath === '' ? './' : (relPath.replace(/\\/g, '/') + '/');
    
    content = content.replace(/from \"@\//g, 'from \"' + prefix);
    content = content.replace(/from \'@\//g, 'from \'' + prefix);
    content = content.replace(/import\(\"@\//g, 'import(\"' + prefix);
    
    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log('Fixed:', filepath, 'with prefix:', prefix);
    }
  });
});
