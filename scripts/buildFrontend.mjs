import { build } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
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
  console.log('✅ Frontend build succeeded!');
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
}
