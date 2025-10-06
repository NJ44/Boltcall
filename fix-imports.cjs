const fs = require('fs');
const path = require('path');

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixImports(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix Button imports
      content = content.replace(
        /import Button from ['"]([^'"]*\/ui\/Button)['"];?/g,
        "import { Button } from '$1';"
      );
      
      fs.writeFileSync(filePath, content);
    }
  });
}

fixImports('./src');
console.log('Fixed all Button imports');
