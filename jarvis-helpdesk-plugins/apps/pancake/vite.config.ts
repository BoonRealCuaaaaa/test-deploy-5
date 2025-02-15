import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import path, { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import { changeLocation } from './rollup/modifiers/manifest';
import { extractMarketplaceTranslation } from './rollup/modifiers/translations';
import StaticCopy from './rollup/static-copy-plugin';
import TranslationsLoader from './rollup/translations-loader-plugin';
import manifest from './src/manifest.json';

import tailwindcss from 'tailwindcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viteManifestHackIssue846: Plugin & {
  renderCrxManifest: (manifest: any, bundle: Record<string, { fileName?: string }>) => void;
} = {
  name: 'manifestHackIssue846',
  description: '',
  filename: '',
  length: 0,
  item(_index: number) {
    return null;
  },
  namedItem(_name: string) {
    return null;
  },
  renderCrxManifest(_manifest, bundle) {
    const manifestAsset = bundle['.vite/manifest.json'] as { fileName?: string };
    bundle['manifest.json'] = manifestAsset;
    bundle['manifest.json'].fileName = 'manifest.json';
    delete bundle['.vite/manifest.json'];
  },
};

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    base: './',
    plugins: [
      crx({ manifest }),
      react(),
      svgr(),
      tsconfigPaths(),
      TranslationsLoader(),
      StaticCopy({
        targets: [
          { src: resolve(__dirname, 'src/assets/*'), dest: 'assets' },
          {
            src: resolve(__dirname, 'src/manifest.json'),
            dest: './',
            modifier: changeLocation,
          },
          {
            src: resolve(__dirname, 'src/translations/*'),
            dest: 'translations',
            modifier: extractMarketplaceTranslation,
          },
        ],
      }),
      viteManifestHackIssue846,
    ],
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    resolve: {
      alias: {
        '@/shared': path.resolve(__dirname, '../../packages/shared/src'),
        '@/src': path.resolve(__dirname, 'src'),
      },
    },
    root: 'src',
    server: {
      port: process.env.VITE_PORT ? +process.env.VITE_PORT : 8000,
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html'),
          sidepanel: resolve(__dirname, 'src/sidepanel.html'),
          content: resolve(__dirname, 'src/content/index.ts'),
          background: resolve(__dirname, 'src/background/index.ts'),
        },
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`,
        },
        watch: {
          include: 'src/**',
        },
      },
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
  };
});
