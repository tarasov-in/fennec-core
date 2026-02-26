import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { transformSync } from 'esbuild';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const libRoot = path.resolve(__dirname, '../../src');

// process.env для браузера (библиотека ожидает process как в Next.js)
const processEnv = {
  REACT_APP_PORT: process.env.REACT_APP_PORT || '',
  REACT_APP_PORTWS: process.env.REACT_APP_PORTWS || '',
  REACT_APP_SCHEMWS: process.env.REACT_APP_SCHEMWS || 'ws',
  REACT_APP_SCHEMHTTP: process.env.REACT_APP_SCHEMHTTP || 'http',
  REACT_APP_AUTHSCHEMHTTP: process.env.REACT_APP_AUTHSCHEMHTTP || '',
  REACT_APP_PROFILE: process.env.REACT_APP_PROFILE || 'dev',
};

// Преобразует .js с JSX из fennec-core до фазы import analysis (парсер Vite не понимает JSX в .js)
function fennecCoreJsxPlugin() {
  return {
    name: 'fennec-core-jsx',
    enforce: 'pre',
    load(id) {
      if (!id.startsWith(libRoot) || !id.endsWith('.js')) return null;
      try {
        const code = fs.readFileSync(id, 'utf-8');
        const result = transformSync(code, { loader: 'jsx', sourcefile: id });
        return { code: result.code, map: result.map };
      } catch {
        return null;
      }
    },
  };
}

export default defineConfig({
  plugins: [
    fennecCoreJsxPlugin(),
    react({ include: /\.(jsx|js|tsx|ts)$/ }),
  ],
  define: {
    // Подмена process для браузера (в Next.js process уже есть)
    process: `({env:${JSON.stringify(processEnv)}})`,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  resolve: {
    alias: [
      // Специфичные пути первыми, иначе "fennec-core" съедает "fennec-core/components/..."
      { find: 'fennec-core/adapters/antd', replacement: path.resolve(__dirname, '../../src/adapters/antd/index.js') },
      { find: 'fennec-core/components/Action', replacement: path.resolve(__dirname, '../../src/components/Action/index.js') },
      { find: 'fennec-core/components/Collection', replacement: path.resolve(__dirname, '../../src/components/Collection/index.js') },
      { find: 'fennec-core/components/Field', replacement: path.resolve(__dirname, '../../src/components/Field/index.js') },
      { find: 'fennec-core/components/Model', replacement: path.resolve(__dirname, '../../src/components/Model/index.js') },
      { find: 'fennec-core', replacement: path.resolve(__dirname, '../../src/index.js') },
    ],
  },
  server: {
    port: 5174,
  },
});
