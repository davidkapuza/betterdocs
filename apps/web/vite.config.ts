/// <reference types='vitest' />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/apps/web',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/web',
      provider: 'v8' as const,
    },
  },
  resolve: {
    alias: {
      '@/app': path.resolve('src/app'),
      '@/entities': path.resolve('src/entities'),
      '@/features': path.resolve('src/features'),
      '@/pages': path.resolve('src/pages'),
      '@/shared': path.resolve('src/shared'),
      '@/widgets': path.resolve('src/widgets'),
      '@betterdocs/ui': path.resolve('../../libs/ui/src/ui'),
      '@betterdocs/plate-ui': path.resolve('../../libs/plate-ui/src/ui'),
      '@betterdocs/plate-hooks': path.resolve('../../libs/plate-ui/src/hooks'),
      '@betterdocs/styles': path.resolve('../../libs/ui/src/styles'),
    },
  },
}));
