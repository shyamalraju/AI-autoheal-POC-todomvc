const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function cleanDOMContent(htmlContent) {
  const $ = cheerio.load(htmlContent);
  $('script, style').remove();

  const title = $('title').text() || '';
  const body = $('body').html() || '';

  return `<html><head><title>${title}</title></head><body>${body}</body></html>`;
}

const failuresDir = 'cypress/failures';

if (!fs.existsSync(failuresDir)) {
  console.log('No failures directory found');
  process.exit(0);
}

const htmlFiles = fs.readdirSync(failuresDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(failuresDir, file), 'utf8');
  const cleaned = cleanDOMContent(content);
  const cleanedFile = file.replace('.html', '-clean.html');
  fs.writeFileSync(path.join(failuresDir, cleanedFile), cleaned);
  console.log(`Cleaned ${file} → ${cleanedFile}: ${content.length} → ${cleaned.length} chars`);
});

console.log(`Processed ${htmlFiles.length} file(s)`); 