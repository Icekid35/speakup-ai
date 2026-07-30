import { build } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔨 Building SpeakUp.ai frontend using Vite JS API...');

try {
  await build({
    root: rootDir,
    configFile: false,
    plugins: [react()],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    build: {
      outDir: path.resolve(rootDir, 'dist'),
      emptyOutDir: true,
    },
  });

  // Copy app-images folder to dist/app-images so image assets exist in production
  const appImagesSrc = path.resolve(rootDir, 'app-images');
  const appImagesDest = path.resolve(rootDir, 'dist/app-images');
  if (fs.existsSync(appImagesSrc)) {
    fs.mkdirSync(appImagesDest, { recursive: true });
    fs.cpSync(appImagesSrc, appImagesDest, { recursive: true });
    console.log('📁 Copied app-images to dist/app-images successfully!');
  }

  console.log('✅ Frontend build succeeded!');
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
}
