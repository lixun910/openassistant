#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = join(__dirname, '..');

// Essential packages that should always be built
const essentialPackages = [
  'packages/utils',
  'packages/components/common',
  'packages/components/hooks',
  'packages/components/leaflet',
  'packages/components/tables',
  'packages/components/vegalite',
  'packages/components/keplergl',
];

console.log('🚀 Building essential packages...\n');

let successCount = 0;
let failCount = 0;

for (const packagePath of essentialPackages) {
  try {
    console.log(`📦 Building ${packagePath}...`);
    execSync('yarn build', { 
      cwd: join(workspaceRoot, packagePath),
      stdio: 'inherit'
    });
    console.log(`✅ ${packagePath} built successfully\n`);
    successCount++;
  } catch (error) {
    console.log(`❌ ${packagePath} failed to build\n`);
    failCount++;
  }
}

console.log(`\n📊 Build Summary:`);
console.log(`✅ Successful: ${successCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📦 Total: ${essentialPackages.length}`);

if (failCount === 0) {
  console.log('\n🎉 All essential packages built successfully!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some packages failed to build');
  process.exit(1);
}