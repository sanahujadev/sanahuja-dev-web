
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

try {
  // After the build, find the generated CSS file(s)
  // It's safer to look for any .css file in the _astro directory
  const cssFiles = glob.sync('dist/_astro/*.css');
  
  if (cssFiles.length === 0) {
    console.warn('⚠️ No CSS file found in dist/_astro/. Skipping CSS inline generation.');
    process.exit(0);
  }
  
  // Assuming the first one is the main CSS file, which is usually the case in Astro builds.
  const cssContent = readFileSync(cssFiles[0], 'utf-8');

  // Save it as a reusable snippet
  writeFileSync('src/styles/critical-inline.css', cssContent);

  console.log(`✅ CSS inline snippet generated from ${cssFiles[0]}`);
} catch (error) {
  console.error('❌ Error generating inline CSS:', error);
  process.exit(1);
}
