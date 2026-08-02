const fs = require('fs');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/isOverالسعة الاستيعابية/g, 'isOverCapacity');
  
  // also check if any other variable was touched like Class Name -> Class اسم الفصل?
  content = content.replace(/Class السعة الاستيعابية/g, 'Class Capacity'); // Wait I translated /Capacity/g

  fs.writeFileSync(filePath, content, 'utf8');
}

processFile('views/ClassManagement.tsx');
