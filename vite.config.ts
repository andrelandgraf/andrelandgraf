import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { vercelPreset } from '@vercel/remix/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

installGlobals();

export default defineConfig({
  build: {
    target: 'esnext', //browsers can handle the latest ES features
  },
  plugins: [remix({ presets: [vercelPreset()] }), tsconfigPaths()],
});
