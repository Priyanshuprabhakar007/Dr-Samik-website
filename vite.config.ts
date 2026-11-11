import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'node:fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Legacy CMS image URLs already stored in Firestore use /src/assets/images/.
      // Copy source images to the same public paths in the production build,
      // without renaming paths or requiring risky Firestore migrations.
      {
        name: 'preserve-legacy-cms-image-urls',
        apply: 'build' as const,
        generateBundle(this: any) {
          const dir = path.resolve(__dirname, 'src/assets/images');
          if (!fs.existsSync(dir)) return;
          for (const file of fs.readdirSync(dir)) {
            if (!/\.(?:jpg|jpeg|png|webp|svg)$/i.test(file)) continue;
            this.emitFile({
              type: 'asset',
              fileName: `src/assets/images/${file}`,
              source: fs.readFileSync(path.join(dir, file)),
            });
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
